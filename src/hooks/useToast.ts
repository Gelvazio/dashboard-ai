import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from './ToastContext';

/** Dispara avisos rápidos de sucesso/erro (precisa de <ToastProvider>). */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>.');
  return ctx;
}
