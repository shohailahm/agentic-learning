import { facts } from "../relay/mockData";

export function TicketFacts() {
  return (
    <aside className="panel facts-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">Ticket</p>
          <h2>Refund request</h2>
        </div>
        <span className="ticket-id">R-1042</span>
      </div>
      <dl>
        {facts.map(([label, value]) => (
          <div className="fact" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
