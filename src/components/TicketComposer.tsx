import { useReducer, useRef, useState } from "react";
import { drafts } from "../relay/mockData";
import { initialState, runReducer, type RunState } from "../relay/runReducer";

type Mode = keyof typeof drafts;

function statusText(run: RunState) {
  switch (run) {
    case "submitting":
      return "Sending request.";
    case "generating":
      return "Draft generation started.";
    case "complete":
      return "Draft ready.";
    case "interrupted":
      return "Generation interrupted. Partial draft preserved.";
    case "cancelled":
      return "Generation stopped.";
    default:
      return "";
  }
}

export function TicketComposer() {
  const [mode, setMode] = useState<Mode>("scoped");
  const [message, setMessage] = useState(
    "Can you check the status of Maya's refund for order R-1042?",
  );
  const [state, dispatch] = useReducer(runReducer, initialState);
  const timer = useRef<number | undefined>(undefined);

  function startMockRun(action: "SUBMIT" | "RETRY" = "SUBMIT") {
    if (!message.trim()) {
      dispatch({ type: "FAILED", message: "Add a ticket message before submitting." });
      return;
    }

    window.clearTimeout(timer.current);
    dispatch({ type: action });
    timer.current = window.setTimeout(() => {
      dispatch({ type: "START_GENERATING" });
      timer.current = window.setTimeout(() => {
        dispatch({ type: "COMPLETE", text: drafts[mode] });
      }, 900);
    }, 500);
  }

  function stopMockRun() {
    window.clearTimeout(timer.current);
    dispatch({ type: "STOP" });
  }

  const isRunning = state.run === "submitting" || state.run === "generating";
  const canRetry = state.run === "failed" || state.run === "interrupted" || state.run === "cancelled";

  return (
    <section className="panel lab-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">Composer</p>
          <h2>Draft a reply</h2>
        </div>
        <span className={`run-state ${state.run}`}>{state.run}</span>
      </div>

      <label className="composer-label" htmlFor="ticket-message">
        Ticket message
      </label>
      <textarea
        id="ticket-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={4}
        placeholder="Describe the customer's request"
      />

      <div className="mode-switch" role="group" aria-label="Instruction mode">
        {(["vague", "scoped"] as const).map((option) => (
          <button
            className={mode === option ? "mode active" : "mode"}
            key={option}
            onClick={() => setMode(option)}
          >
            {option === "vague" ? "Vague instruction" : "Scoped instruction"}
          </button>
        ))}
      </div>

      <div className="instruction">
        {mode === "vague"
          ? "Answer the customer helpfully."
          : "Use only the supplied facts. State what is unknown, do not invent dates, and ask for the missing approval date."}
      </div>

      <div className="actions">
        <button className="primary" onClick={() => startMockRun()} disabled={isRunning}>
          Generate mock draft
        </button>
        {isRunning && (
          <button className="secondary" onClick={stopMockRun}>
            Stop
          </button>
        )}
        {canRetry && (
          <button className="secondary" onClick={() => startMockRun("RETRY")}>
            Retry
          </button>
        )}
      </div>

      <div className="status-region" role="status" aria-live="polite">
        {statusText(state.run)}
      </div>
      {state.run === "failed" && (
        <div className="error" role="alert">
          {state.error}
        </div>
      )}

      <div className="draft" aria-live="polite">
        <div className="draft-heading">
          <span className="section-label">Draft response</span>
          {state.text && <span className="generated">Generated locally</span>}
        </div>
        <p>{state.text || "Submit the ticket to inspect the mock response."}</p>
      </div>
    </section>
  );
}
