export type NoAsterisk<T extends string> = T extends `${string}*${string}` ? never : T
export type NoColon<T extends string> = T extends `${string}:${string}` ? never : T
export type NoDash<T extends string> = T extends `${string}\\${string}` ? never : T
export type NoDotSlash<T extends string> = T extends `${string}./${string}` ? never : T
export type NoLessThan<T extends string> = T extends `${string}<${string}` ? never : T
export type NoMoreThan<T extends string> = T extends `${string}>${string}` ? never : T
export type NoMultipleDots<T extends string> = T extends `${string}..${string}` ? never : T
export type NoMultipleSlashes<T extends string> = T extends `${string}//${string}` ? never : T
export type NoPipe<T extends string> = T extends `${string}|${string}` ? never : T
export type NoQuestionMark<T extends string> = T extends `${string}?${string}` ? never : T
export type NoQuote<T extends string> = T extends `${string}"${string}` ? never : T
export type NonEmpty<T extends string> = "" extends T ? never : T
export type StartsWithSlash<T extends string> = T extends `/${string}` ? T : never

export type NoDisallowedCharacters<T extends string> = NonEmpty<T> &
  StartsWithSlash<T> &
  NoAsterisk<T> &
  NoColon<T> &
  NoDash<T> &
  NoDotSlash<T> &
  NoLessThan<T> &
  NoMoreThan<T> &
  NoMultipleDots<T> &
  NoMultipleSlashes<T> &
  NoPipe<T> &
  NoQuestionMark<T> &
  NoQuote<T>

export const disallowedCharacters = ["<", ">", ":", '"', "\\", "|", "?", "*", "..", "./", "//"]

export const hasForbiddenChars = (path: string) =>
  disallowedCharacters.some((disallowed) => path.includes(disallowed))

export const isEmpty = (path: string) => path.trim() === ""

export const startsWithSlash = (path: string) => path.startsWith("/")

export const endsWithSlash = (path: string) => path.endsWith("/")

export const isValidPath = (path: string) =>
  !isEmpty(path) && !hasForbiddenChars(path) && startsWithSlash(path)
