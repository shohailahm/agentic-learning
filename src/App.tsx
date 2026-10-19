import { TicketComposer } from "./components/TicketComposer";
import { TicketFacts } from "./components/TicketFacts";

function App() {
  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Relay Lab · Day 7</p>
          <h1>Support inbox</h1>
          <p className="subtitle">
            A small, accessible surface for testing AI support-run states before
            adding a live model or stream.
          </p>
        </div>
        <span className="status">Mock mode · local only</span>
      </header>

      <section className="workspace" aria-label="Prompt baseline workspace">
        <TicketFacts />
        <TicketComposer />
      </section>

      <footer className="lesson-note">
        <strong>Today’s question:</strong> Which sentences are supported by the
        ticket facts, and which only sound plausible?
      </footer>
    </main>
  );
}

export default App;
