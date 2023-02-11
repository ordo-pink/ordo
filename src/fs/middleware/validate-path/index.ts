import { OrdoFile, OrdoDirectory } from "@ordo-pink/core"
import type { RequestHandler } from "express"

export const validateFilePath: RequestHandler = (req, res, next) => {
  if (req.params.path && !OrdoFile.isValidPath(req.params.path)) {
    res.status(400).send("Invalid path")
    return
  }

  if (req.params.oldPath && !OrdoFile.isValidPath(req.params.oldPath)) {
    res.status(400).send("Invalid oldPath")
    return
  }

  if (req.params.newPath && !OrdoFile.isValidPath(req.params.newPath)) {
    res.status(400).send("Invalid newPath")
    return
  }

  next()
}

export const validateDirectoryPath: RequestHandler = (req, res, next) => {
  if (req.params.path && !OrdoDirectory.isValidPath(req.params.path)) {
    res.status(400).send("Invalid path")
    return
  }

  if (req.params.oldPath && !OrdoDirectory.isValidPath(req.params.oldPath)) {
    res.status(400).send("Invalid oldPath")
    return
  }

  if (req.params.newPath && !OrdoDirectory.isValidPath(req.params.newPath)) {
    res.status(400).send("Invalid newPath")
    return
  }

  next()
}
