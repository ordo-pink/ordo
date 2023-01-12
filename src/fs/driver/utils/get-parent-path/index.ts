export const getParentPath = (path: string): string => {
  const hasSeparatorAtTheEnd = path.endsWith("/")
  const splittablePath = hasSeparatorAtTheEnd ? path.slice(0, -1) : path
  const lastSeparatorPosition = splittablePath.lastIndexOf("/") + 1

  return splittablePath.slice(0, lastSeparatorPosition)
}
