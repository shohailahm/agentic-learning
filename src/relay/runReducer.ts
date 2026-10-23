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
  resultKey: string | null;
  error?: string;
};

export type Action =
  | { type: "SUBMIT"; resultKey: string }
  | { type: "START_GENERATING" }
  | { type: "COMPLETE"; text: string }
  | { type: "INTERRUPTED" }
  | { type: "STOP" }
  | { type: "FAILED"; message: string }
  | { type: "RETRY"; resultKey: string };

export const initialState: State = { run: "idle", text: "", resultKey: null };

export function runReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT":
    case "RETRY":
      return {
        run: "submitting",
        text: "",
        resultKey: action.resultKey,
        error: undefined,
      };
    case "START_GENERATING":
      return { ...state, run: "generating", error: undefined };
    case "COMPLETE":
      return { ...state, run: "complete", text: action.text };
    case "INTERRUPTED":
      return { ...state, run: "interrupted" };
    case "STOP":
      return { ...state, run: "cancelled" };
    case "FAILED":
      return { ...state, run: "failed", text: "", error: action.message };
  }
}
