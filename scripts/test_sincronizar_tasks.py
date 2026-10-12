"""Testes unitários (offline) do formato Markdown de scripts/sincronizar_tasks.py.

Executar:  python3 -m unittest discover -s scripts -p "test_*.py"
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sincronizar_tasks as st  # noqa: E402

TASK = {
    "codigo": "TASK-0007", "titulo": "Título: com dois-pontos", "instrucao": "Linha 1\n\n- item", "tipo": "ia",
    "prioridade": 2, "ordem": 3, "dependencias": ["TASK-0001", "TASK-0002"], "executar": False,
    "executar_apos": None, "max_tentativas": 3, "status": "concluida", "tentativas": 1,
    "resultado": "Relatório\nem duas linhas", "pr_url": "https://github.com/x/y/pull/1", "commit_sha": "abc1234",
}


class TestFormatoMarkdown(unittest.TestCase):
    def test_ida_e_volta(self):
        lido = st.markdown_para_task(st.task_para_markdown(TASK))
        for campo in st.CAMPOS_EDITAVEIS + ["codigo", "status", "resultado"]:
            self.assertEqual(lido.get(campo), TASK[campo], campo)
        self.assertEqual(st.diferencas(lido, TASK), [])

    def test_arquivo_minimo_sem_codigo(self):
        t = st.markdown_para_task("---\ntitulo: Nova\n---\nFazer algo\n")
        self.assertNotIn("codigo", t)
        self.assertEqual(t["instrucao"], "Fazer algo")

    def test_comentario_e_booleanos(self):
        t = st.markdown_para_task("---\ntitulo: X\nexecutar: off  # desligada\nstatus: pendente # info\n---\nY")
        self.assertIs(t["executar"], False)
        self.assertEqual(t["status"], "pendente")

    def test_validacoes(self):
        for texto in ["sem cabecalho", "---\nprioridade: 1\n---\nY", "---\ntitulo: X\n---\n",
                      "---\ntitulo: X\nprioridade: 9\n---\nY", "---\ntitulo: X\nstatus: feito\n---\nY",
                      "---\ntitulo: X\nordem: abc\n---\nY", "---\ntitulo: X\ntipo: robo\n---\nY"]:
            with self.assertRaises(st.ErroSync, msg=texto):
                st.markdown_para_task(texto)

    def test_diferencas(self):
        local = dict(TASK, prioridade=5, instrucao="outra")
        difs = st.diferencas(local, TASK)
        self.assertEqual(len(difs), 2)

    def test_projeto_no_cabecalho(self):
        texto = st.task_para_markdown(TASK, "meu-app")
        self.assertIn("\nprojeto: meu-app\n", texto)
        lido = st.markdown_para_task(texto)
        self.assertEqual(lido["projeto"], "meu-app")
        st.verificar_projeto([(Path("a.md"), lido)], "meu-app")
        with self.assertRaises(st.ErroSync):
            st.verificar_projeto([(Path("a.md"), lido)], "outro")
        st.verificar_projeto([(Path("b.md"), {"titulo": "sem projeto"})], "outro")

    def test_tipo_humano(self):
        t = st.markdown_para_task("---\ntitulo: Aprovar\ntipo: humano\n---\nRevisar o PR")
        self.assertEqual(t["tipo"], "humano")

    def test_nome_arquivo(self):
        self.assertEqual(st.nome_arquivo("TASK-0001"), "TASK-0001.md")
        self.assertEqual(st.nome_arquivo("a/b c"), "a_b_c.md")


if __name__ == "__main__":
    unittest.main()
