/**
 * Alternativas de acesso na tela de login: link mágico por e-mail e "Esqueci a senha".
 * Usa o e-mail já digitado no formulário e volta para a tela atual (`urlDeRetorno`).
 */
import { useState } from 'react';
import { Botao } from '@/components/ui/Botao';
import { urlDeRetorno } from '@/lib/auth';
import { enviarLinkMagico, redefinirSenha } from '@/services/authService';

type Acao = 'link' | 'senha';

export interface RecuperarAcessoProps {
  email: string;
}

export function RecuperarAcesso({ email }: RecuperarAcessoProps) {
  const [enviando, setEnviando] = useState<Acao | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null);

  async function executar(acao: Acao) {
    const alvo = email.trim();
    if (!alvo) {
      setAviso({ tipo: 'erro', texto: 'Informe o e-mail acima primeiro.' });
      return;
    }
    setEnviando(acao);
    setAviso(null);
    try {
      const retorno = urlDeRetorno(window.location);
      if (acao === 'link') await enviarLinkMagico(alvo, retorno);
      else await redefinirSenha(alvo, retorno);
      setAviso({
        tipo: 'ok',
        texto:
          acao === 'link'
            ? `Enviamos um link de acesso para ${alvo}.`
            : `Enviamos as instruções para redefinir a senha para ${alvo}.`,
      });
    } catch (e) {
      setAviso({ tipo: 'erro', texto: (e as Error).message });
    } finally {
      setEnviando(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Botao variante="fantasma" carregando={enviando === 'link'} disabled={enviando !== null} onClick={() => void executar('link')}>
          Entrar com link por e-mail
        </Botao>
        <Botao variante="fantasma" carregando={enviando === 'senha'} disabled={enviando !== null} onClick={() => void executar('senha')}>
          Esqueci a senha
        </Botao>
      </div>
      {aviso && (
        <p
          role={aviso.tipo === 'erro' ? 'alert' : 'status'}
          className={aviso.tipo === 'erro' ? 'text-sm text-rose-600 dark:text-rose-400' : 'text-sm text-emerald-600 dark:text-emerald-400'}
        >
          {aviso.texto}
        </p>
      )}
    </div>
  );
}
