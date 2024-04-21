import { Either } from "../either.impl"

export const emptyE = () => Either.right<undefined, never>(undefined)
