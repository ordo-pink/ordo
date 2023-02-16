/**
 * Characters that cannot be used in an Ordo fs path.
 */
export const disallowedCharacters = [
  "<",
  ">",
  ":",
  '"',
  "\\",
  "|",
  "?",
  "*",
  "..",
  "./",
  "//",
] as const

export const hasForbiddenChars = (path: string) =>
  disallowedCharacters.some((disallowed) => path.includes(disallowed))

export const isEmpty = (path: string) => path.trim() === ""

export const startsWithSlash = (path: string) => path.startsWith("/")

export const endsWithSlash = (path: string) => path.endsWith("/")

export const isValidPath = (path: string) =>
  !isEmpty(path) && !hasForbiddenChars(path) && startsWithSlash(path)
