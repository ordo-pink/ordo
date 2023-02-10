export const disallowedCharacters = ["<", ">", ":", '"', "\\", "|", "?", "*", "..", "./"]

export const hasForbiddenChars = (path: string) =>
  disallowedCharacters.some((disallowed) => path.includes(disallowed))

export const startsWithSlash = (path: string) => path.startsWith("/")

export const endsWithSlash = (path: string) => path.endsWith("/")

export const isValidPath = (path: string) => !hasForbiddenChars(path) && startsWithSlash(path)
