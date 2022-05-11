import { Either } from "or-else";

import { noOpFn } from "@utils/no-op";

export const FoldVoid = [noOpFn, noOpFn] as const;

export const fromBoolean = (x: boolean) => (x ? Either.right(x) : Either.left(x));
