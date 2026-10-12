#!/usr/bin/env bash
# Captura paralela entre projetos: N sessões simultâneas (service_role) chamando
# pegar_proxima_task não podem pegar a mesma task; com p_exclusivo, 1 por projeto.
set -euo pipefail
PSQL=${PSQL:-"sudo -n -u postgres psql"}
DB=${DB:-dashai_test}
q() { $PSQL -X -q -At -v ON_ERROR_STOP=1 -d "$DB" -c "$1"; }
TMP=$(mktemp -d)

q "insert into public.projects (slug, nome) select 'par-' || g, 'Paralelo ' || g from generate_series(1,3) g on conflict do nothing;
   insert into public.tasks (project_id, titulo, instrucao, prioridade)
   select p.id, 'par ' || g, 'x', 1 + (g % 5) from public.projects p, generate_series(1,20) g where p.slug like 'par-%';
   update public.projects set ativo = (slug like 'par-%');" >/dev/null  # agentes sem projeto só enxergam os par-*

pegar() {  # $1 = agente, $2 = projeto ('' = qualquer) ; repete até a fila esvaziar
  local proj=$2 id
  while :; do
    if [ -n "$proj" ]; then
      id=$(q "set role service_role; select id from public.pegar_proxima_task('$1', '$proj')")
    else
      id=$(q "set role service_role; select id from public.pegar_proxima_task('$1')")
    fi
    [ -z "$id" ] && break
    echo "$id" >> "$TMP/$1"
  done
}
for i in $(seq 1 12); do
  case $((i % 4)) in 0) p='';; *) p="par-$((i % 4))";; esac
  pegar "ag$i" "$p" &
done
wait
total=$(cat "$TMP"/ag* 2>/dev/null | wc -l); unicos=$(cat "$TMP"/ag* | sort -u | wc -l)
esperado=$(q "select count(*) from public.tasks t join public.projects p on p.id=t.project_id where p.slug like 'par-%'")
emexec=$(q "select count(*) from public.tasks t join public.projects p on p.id=t.project_id where p.slug like 'par-%' and status='em_execucao'")
[ "$total" = "$unicos" ] && [ "$total" = "$esperado" ] && [ "$emexec" = "$esperado" ] \
  || { echo "FALHOU: paralelo total=$total unicos=$unicos esperado=$esperado em_execucao=$emexec"; exit 1; }
echo "OK: 12 agentes em paralelo pegaram $total tasks de 3 projetos sem duplicidade"

q "insert into public.projects (slug, nome) values ('excl', 'Exclusivo') on conflict do nothing;
   insert into public.tasks (project_id, titulo, instrucao) select id, 'ex ' || g, 'x' from public.projects, generate_series(1,5) g where slug = 'excl';" >/dev/null
for i in $(seq 1 10); do
  q "set role service_role; select id from public.pegar_proxima_task('ex$i', 'excl', 90, true)" > "$TMP/ex$i" &
done
wait
n=$(cat "$TMP"/ex* | grep -c . || true)
[ "$n" = "1" ] || { echo "FALHOU: exclusivo entregou $n tasks (esperado 1)"; exit 1; }
echo "OK: p_exclusivo=true com 10 chamadas simultâneas entregou 1 task do projeto"
rm -rf "$TMP"
