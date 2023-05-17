import { FORBIDDEN_PATH_SYMBOLS } from "@ordo-pink/common-types"

export const hasForbiddenChars = (path: string) =>
  FORBIDDEN_PATH_SYMBOLS.some((disallowed) => path.includes(disallowed))

export const isEmpty = (path: string) => path.trim() === ""

export const startsWithSlash = (path: string) => path.startsWith("/")

export const endsWithSlash = (path: string) => path.endsWith("/")

export const isValidPath = (path: string) =>
  !isEmpty(path) && !hasForbiddenChars(path) && startsWithSlash(path)
