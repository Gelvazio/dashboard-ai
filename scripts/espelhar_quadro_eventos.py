#!/usr/bin/env python3
"""Espelha o quadro Markdown (commits de trava/entrega) em eventos de `agent_events` (SUB-35).

Esta etapa (SUB-35.42) só tem a função pura `commits_para_eventos`; a CLI que lê o
`git log` e envia ao PostgREST fica na SUB-35.43.

Entrada: linhas de `git log --format='%H%x09%aI%x09%s'`.
Mapeamento:
  lock: assumindo sub-task SUB-X por <agente>        -> tipo `trava`
  feat(SUB-X): ... [— <agente>]                       -> tipo `commit`
  docs(board): concluir SUB-X ... [de <agente>]       -> tipo `fim`
Cada evento usa `chave_idempotencia = 'git:<sha>'` (reenviar não duplica).
"""
from __future__ import annotations

import re
from typing import Iterable

AGENTE_DESCONHECIDO = "desconhecido"

_RE_LOCK = re.compile(r"^lock: assumindo sub-task (SUB-[\d.]*\d) por (.+?)\s*$", re.I)
_RE_FEAT = re.compile(r"^feat\((SUB-[\d.]*\d)\):\s*(.*?)\s*$", re.I)
_RE_FIM = re.compile(r"^docs\(board\):\s*concluir (SUB-[\d.]*\d)\b(.*)$", re.I)
_RE_AGENTE_FEAT = re.compile(r"\s+[—-]\s+([^—]+?)\s*$")
_RE_AGENTE_FIM = re.compile(r"\bde\s+(.+?)\s*$")


def _agente(texto: str | None) -> str:
    texto = (texto or "").strip()
    return texto[:120] if texto else AGENTE_DESCONHECIDO


def commits_para_eventos(linhas: Iterable[str]) -> list[dict]:
    """Converte linhas `sha<TAB>data ISO<TAB>assunto` em eventos de `agent_events`.

    Linhas vazias, malformadas ou de commits que não são trava/entrega são ignoradas.
    A ordem de entrada é preservada.
    """
    eventos: list[dict] = []
    for linha in linhas:
        partes = linha.rstrip("\r\n").split("\t", 2)
        if len(partes) != 3 or not partes[0].strip():
            continue
        sha, data, assunto = (p.strip() for p in partes)
        if m := _RE_LOCK.match(assunto):
            codigo, tipo, agente = m.group(1), "trava", _agente(m.group(2))
        elif m := _RE_FEAT.match(assunto):
            codigo, tipo = m.group(1), "commit"
            a = _RE_AGENTE_FEAT.search(m.group(2))
            agente = _agente(a.group(1) if a else None)
        elif m := _RE_FIM.match(assunto):
            codigo, tipo = m.group(1), "fim"
            a = _RE_AGENTE_FIM.search(m.group(2))
            agente = _agente(a.group(1) if a else None)
        else:
            continue
        eventos.append(
            {
                "tipo": tipo,
                "task_codigo": codigo,
                "agente": agente,
                "mensagem": assunto[:2000],
                "created_at": data,
                "metadados": {"sha": sha},
                "chave_idempotencia": f"git:{sha}",
            }
        )
    return eventos
