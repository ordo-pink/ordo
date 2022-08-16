import { Unary } from "or-else";

export const tap =
  <T>(f: Unary<T, any>) =>
  (arg: T) => {
    f(arg);
    return arg;
  };

export const id = <T>(x: T): T => x;
