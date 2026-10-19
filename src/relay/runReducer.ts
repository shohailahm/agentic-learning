export type RunState =
  | "idle"
  | "submitting"
  | "generating"
  | "complete"
  | "interrupted"
  | "cancelled"
  | "failed";

export type State = {
  run: RunState;
  text: string;
  error?: string;
};

export type Action =
  | { type: "SUBMIT" }
  | { type: "START_GENERATING" }
  | { type: "COMPLETE"; text: string }
  | { type: "INTERRUPTED" }
  | { type: "STOP" }
  | { type: "FAILED"; message: string }
  | { type: "RETRY" };

export const initialState: State = { run: "idle", text: "" };

export function runReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT":
    case "RETRY":
      return { run: "submitting", text: "", error: undefined };
    case "START_GENERATING":
      return { ...state, run: "generating", error: undefined };
    case "COMPLETE":
      return { run: "complete", text: action.text };
    case "INTERRUPTED":
      return { ...state, run: "interrupted" };
    case "STOP":
      return { ...state, run: "cancelled" };
    case "FAILED":
      return { run: "failed", text: "", error: action.message };
  }
}
