/**
 * A set of validators for various keys supported by the Editor.
 */
export const IsKey: Record<string, (event: KeyboardEvent) => boolean> = {
  // Is ctrl (or cmd) pressed
  ctrl: (event: KeyboardEvent) => event.ctrlKey || event.metaKey,
  // Is shift pressed
  shift: (event: KeyboardEvent) => event.shiftKey,

  // ArrowLeft validators
  arrowLeft: (event: KeyboardEvent) => event.key === "ArrowLeft",
  shiftArrowLeft: (event: KeyboardEvent) => IsKey.arrowLeft(event) && IsKey.shift(event),
  ctrlArrowLeft: (event: KeyboardEvent) => IsKey.arrowLeft(event) && IsKey.ctrl(event),
  ctrlShiftArrowLeft: (event: KeyboardEvent) =>
    IsKey.arrowLeft(event) && IsKey.ctrl(event) && IsKey.shift(event),

  // ArrowRight validators
  arrowRight: (event: KeyboardEvent) => event.key === "ArrowRight",
  shiftArrowRight: (event: KeyboardEvent) => IsKey.arrowRight(event) && IsKey.shift(event),
  ctrlArrowRight: (event: KeyboardEvent) => IsKey.arrowRight(event) && IsKey.ctrl(event),
  ctrlShiftArrowRight: (event: KeyboardEvent) =>
    IsKey.arrowRight(event) && IsKey.ctrl(event) && IsKey.shift(event),

  // ArrowDown validators
  arrowDown: (event: KeyboardEvent) => event.key === "ArrowDown",
  shiftArrowDown: (event: KeyboardEvent) => IsKey.arrowDown(event) && IsKey.shift(event),
  ctrlArrowDown: (event: KeyboardEvent) => IsKey.arrowDown(event) && IsKey.ctrl(event),

  // ArrowUp validators
  arrowUp: (event: KeyboardEvent) => event.key === "ArrowUp",
  shiftArrowUp: (event: KeyboardEvent) => IsKey.arrowUp(event) && IsKey.shift(event),
  ctrlArrowUp: (event: KeyboardEvent) => IsKey.arrowUp(event) && IsKey.ctrl(event),

  // Is Enter pressed
  enter: (event: KeyboardEvent) => event.key === "Enter",

  // Backspace validators
  backspace: (event: KeyboardEvent) => event.key === "Backspace",
  ctrlBackspace: (event: KeyboardEvent) => IsKey.backspace(event) && IsKey.ctrl(event),

  // Delete validators
  delete: (event: KeyboardEvent) => event.key === "Delete",
  ctrlDelete: (event: KeyboardEvent) => IsKey.delete(event) && IsKey.ctrl(event),

  // Is typeable char pressed
  char: (event: KeyboardEvent) => !IsKey.ctrl(event) && event.key.length === 1 && !event.altKey,
}
