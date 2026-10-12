import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Botao } from './Botao';

interface Props {
  aberto: boolean;
  titulo: string;
  mensagem: ReactNode;
  rotuloConfirmar?: string;
  perigo?: boolean;
  ocupado?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Confirmação antes de ações destrutivas. */
export function ConfirmDialog({ aberto, titulo, mensagem, rotuloConfirmar = 'Confirmar', perigo, ocupado, onConfirmar, onCancelar }: Props) {
  return (
    <Modal
      aberto={aberto}
      titulo={titulo}
      tamanho="md"
      onFechar={ocupado ? () => {} : onCancelar}
      rodape={
        <>
          <Botao onClick={onCancelar} disabled={ocupado}>Voltar</Botao>
          <Botao variante={perigo ? 'perigo' : 'primario'} onClick={onConfirmar} carregando={ocupado} data-autofocus>
            {rotuloConfirmar}
          </Botao>
        </>
      }
    >
      <div className="flex gap-3">
        {perigo && <AlertTriangle className="size-5 shrink-0 text-rose-500" aria-hidden />}
        <div className="text-sm text-slate-700 dark:text-slate-300">{mensagem}</div>
      </div>
    </Modal>
  );
}
