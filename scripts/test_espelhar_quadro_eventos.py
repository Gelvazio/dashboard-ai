import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from espelhar_quadro_eventos import AGENTE_DESCONHECIDO, commits_para_eventos, enviar_eventos  # noqa: E402

D = "2026-10-12T01:08:08-03:00"


class CommitsParaEventosTest(unittest.TestCase):
    def test_lock_vira_trava(self):
        (e,) = commits_para_eventos([f"aaa\t{D}\tlock: assumindo sub-task SUB-35.42 por DashboardAI-Clone 02\n"])
        self.assertEqual(e["tipo"], "trava")
        self.assertEqual(e["task_codigo"], "SUB-35.42")
        self.assertEqual(e["agente"], "DashboardAI-Clone 02")
        self.assertEqual(e["chave_idempotencia"], "git:aaa")
        self.assertEqual(e["created_at"], D)

    def test_feat_vira_commit(self):
        (e,) = commits_para_eventos([f"bbb\t{D}\tfeat(SUB-23.2): classificarPendentes — DashboardAI-Clone 02"])
        self.assertEqual((e["tipo"], e["task_codigo"], e["agente"]), ("commit", "SUB-23.2", "DashboardAI-Clone 02"))
        (e,) = commits_para_eventos([f"ccc\t{D}\tfeat(SUB-19.1): debounce(fn, ms) em src/lib/debounce.ts"])
        self.assertEqual(e["agente"], AGENTE_DESCONHECIDO)

    def test_docs_board_vira_fim(self):
        (e,) = commits_para_eventos(
            [f"ddd\t{D}\tdocs(board): concluir SUB-21.11 (e4bacb0) e liberar trava de DashboardAI-Clone 10 (Grok Bot)"]
        )
        self.assertEqual((e["tipo"], e["task_codigo"]), ("fim", "SUB-21.11"))
        self.assertEqual(e["agente"], "DashboardAI-Clone 10 (Grok Bot)")
        self.assertEqual(e["metadados"], {"sha": "ddd"})

    def test_ignora_outros_e_malformados(self):
        linhas = ["", "sem tabs", f"eee\t{D}\tMerge branch 'main'", f"fff\t{D}\tchore: x",
                  f"ggg\t{D}\tlock: assumindo sub-task SUB-1 por X"]
        eventos = commits_para_eventos(linhas)
        self.assertEqual([e["chave_idempotencia"] for e in eventos], ["git:ggg"])


class EnviarEventosTest(unittest.TestCase):
    def test_envia_com_projeto_e_ignora_duplicados(self):
        chamadas = []

        class Cli:
            project_id = 7

            def _req(self, metodo, caminho, params=None, corpo=None, prefer=None):
                chamadas.append((metodo, caminho, params, corpo, prefer))

        eventos = commits_para_eventos([f"aaa\t{D}\tlock: assumindo sub-task SUB-1.1 por X"])
        self.assertEqual(enviar_eventos(Cli(), eventos), 1)
        ((metodo, caminho, params, corpo, prefer),) = chamadas
        self.assertEqual((metodo, caminho), ("POST", "agent_events"))
        self.assertEqual(params, {"on_conflict": "project_id,chave_idempotencia"})
        self.assertIn("resolution=ignore-duplicates", prefer)
        self.assertEqual(corpo[0]["project_id"], 7)


if __name__ == "__main__":
    unittest.main()
