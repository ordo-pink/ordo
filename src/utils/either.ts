import { Either } from "or-else";

/**
 * Create a Right.of(true) or a Left.of(false) depending on the provided argument.
 */
export const fromBoolean = (x: boolean) => (x ? Either.right(x) : Either.left(x));
