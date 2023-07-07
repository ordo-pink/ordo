// TYPES ----------------------------------------------------------------------

// deno-lint-ignore no-explicit-any
export type Tap = <X>(f: (x: X) => any) => (x: X) => X;

// IMPL -----------------------------------------------------------------------

/**
 * Run the given unary function with the supplied argument, then return the
 * argument. The return value of the unary function will be thrown away.
 *
 * (a -> *) -> a -> a
 */
export const tap: Tap = (f) => (x) => {
  f(x);

  return x;
};
