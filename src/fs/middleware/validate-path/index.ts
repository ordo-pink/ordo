import type { RequestHandler } from "express"

const disallowedCharacters = ["<", ">", ":", '"', "\\", "|", "?", "*"]

const hasForbiddenChars = (path: string) =>
  path.split("").some((char) => disallowedCharacters.includes(char))
const startsWithSlash = (path: string) => path.startsWith("/")
const endsWithSlash = (path: string) => path.endsWith("/")

const isValidPath = (path: string) => !hasForbiddenChars(path) && startsWithSlash(path)
const isValidFilePath = (path: string) => isValidPath(path) && !endsWithSlash(path)
const isValidDirectoryPath = (path: string) => isValidPath(path) && endsWithSlash(path)

export const validateFilePath: RequestHandler = (req, res, next) => {
  if (req.params.path && !isValidFilePath(req.params.path)) {
    res.status(400).send("Invalid path")
    return
  }

  if (req.params.oldPath && !isValidFilePath(req.params.oldPath)) {
    res.status(400).send("Invalid oldPath")
    return
  }

  if (req.params.newPath && !isValidFilePath(req.params.newPath)) {
    res.status(400).send("Invalid newPath")
    return
  }

  next()
}

export const validateDirectoryPath: RequestHandler = (req, res, next) => {
  if (req.params.path && !isValidDirectoryPath(req.params.path)) {
    res.status(400).send("Invalid path")
    return
  }

  if (req.params.oldPath && !isValidDirectoryPath(req.params.oldPath)) {
    res.status(400).send("Invalid oldPath")
    return
  }

  if (req.params.newPath && !isValidDirectoryPath(req.params.newPath)) {
    res.status(400).send("Invalid newPath")
    return
  }

  next()
}
