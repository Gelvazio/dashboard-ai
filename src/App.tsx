/**
 * Casca inicial do Dashboard AI (SUB-01.1). O layout real (sidebar, header com
 * seletor de projeto, abas de Fila, Memória, Logs e Configurações) chega na SUB-12.
 */
export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Dashboard AI</h1>
      <p>
        Gerenciador genérico de tasks de IA para qualquer projeto: fila com travas e dependências,
        memória persistente semântica e monitor do agendador.
      </p>
    </main>
  );
}
