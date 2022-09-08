import { Unary } from "or-else";

/**
 * Fire the function with the provided argument, then return the argument back.
 */
export const tap =
  <T>(f: Unary<T, any>) =>
  (arg: T) => {
    f(arg);
    return arg;
  };

/**
 * Return what was provided.
 */
export const id = <T>(x: T): T => x;

/**
 * A function that does nothing and returns undefined.
 */
export const noOpFn = () => void 0;

/**
 * The infamous folding tuple.
 */
export const FoldVoid: [() => void, () => void] = [noOpFn, noOpFn];

/**
 * NoOp is a component that renders nothing.
 */
export const NoOp = () => null;
