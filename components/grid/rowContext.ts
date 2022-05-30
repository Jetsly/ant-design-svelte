import { getContext, setContext } from "svelte";
import { derived, get, writable, type Writable } from "svelte/store";

const rowContext = Symbol();

export interface RowContextState {
  gutter?: [number, number];
  wrap?: boolean;
  supportFlexGap?: boolean;
}

export function setRowContext(state: RowContextState) {
  const rowContextState = writable(state);
  setContext<Writable<RowContextState>>(rowContext, rowContextState);
  return rowContextState;
}

export default function getRowContext(): RowContextState {
  const rowContextState = getContext<Writable<RowContextState>>(rowContext);
  return get(rowContextState)
}