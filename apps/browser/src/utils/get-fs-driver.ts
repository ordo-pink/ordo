import { FSDriver } from "@ordo-pink/common-types"
import { Logger } from "@ordo-pink/logger"
import { tap } from "ramda"

const authHeader = "authorization"
const directories = "fs/directories"
const files = "fs/files"

type Params1 = { host: string; logger: Logger }
type Params2 = { token: string; sub: string }

export const getFsDriver =
  ({ host, logger }: Params1) =>
  ({ token, sub }: Params2): FSDriver => ({
    files: {
      create: ({ file, content }) =>
        fetch(`${host}/${files}/${sub}${file.path}`, {
          method: "POST",
          body: content,
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .then(
            tap(
              (res) =>
                res.ok &&
                !file.path.endsWith(".metadata") &&
                fetch(`${host}/${files}/${sub}${file.path}.metadata`, {
                  method: "POST",
                  body: JSON.stringify({
                    ...file.metadata,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now()),
                    createdBy: sub,
                    updatedBy: sub,
                    encryption: "v1", // TODO: Remove this,
                  }),
                  headers: {
                    [authHeader]: `Bearer ${token}`,
                  },
                }).catch(logger.error),
            ),
          )
          .then((res) => res.json())
          .catch(logger.error),
      get: (path) =>
        fetch(`${host}/${files}/${sub}${path}`, {
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .catch(logger.error),
      set: (file) =>
        fetch(`${host}/${files}/${sub}${file.path}.metadata`, {
          method: "PUT",
          body: JSON.stringify({
            ...file.metadata,
            ...file.metadata,
            updatedAt: new Date(Date.now()),
            updatedBy: sub,
          }),
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .catch(logger.error)
          .then(() => file),
      getContent: (path) =>
        fetch(`${host}/${files}/${sub}${path}`, {
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        }),
      setContent: ({ file, content }) =>
        fetch(`${host}/${files}/${sub}${file.path}`, {
          method: "PUT",
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
          body: content,
        })
          .then(
            tap(
              (res) =>
                res.ok &&
                !file.path.endsWith(".metadata") &&
                fetch(`${host}/${files}/${sub}${file.path}.metadata`, {
                  method: "PUT",
                  body: JSON.stringify({
                    ...file.metadata,
                    updatedAt: new Date(Date.now()),
                    updatedBy: sub,
                    encryption: "v1", // TODO: Remove this
                  }),
                  headers: {
                    [authHeader]: `Bearer ${token}`,
                  },
                }).catch(logger.error),
            ),
          )
          .then((res) => res.json())
          .catch(logger.error),
      remove: (path) =>
        fetch(`${host}/${files}/${sub}${path}`, {
          method: "DELETE",
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .catch(logger.error),
      move: ({ oldPath, newPath }) =>
        fetch(`${host}/${files}/${sub}${oldPath}->${newPath}`, {
          method: "PATCH",
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .catch(logger.error),
    },
    directories: {
      create: (path) =>
        fetch(`${host}/${directories}/${sub}${path}`, {
          method: "POST",
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .catch(logger.error),
      set: (directory) =>
        fetch(`${host}/${files}/${sub}${directory.path}.metadata`, {
          method: "PUT",
          body: JSON.stringify({
            ...directory.metadata,
            updatedAt: new Date(Date.now()),
            updatedBy: sub,
          }),
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .catch(logger.error)
          .then(() => directory),
      get: (path) =>
        fetch(`${host}/${directories}/${sub}${path}`, {
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .catch(logger.error),
      remove: (path) =>
        fetch(`${host}/${directories}/${sub}${path}`, {
          method: "DELETE",
          headers: {
            [authHeader]: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .catch(logger.error),
      move: ({ oldPath, newPath }) =>
        fetch(
          `${host}/${directories}/${sub}${
            oldPath.endsWith("/") ? oldPath.slice(0, -1) : oldPath
          }->${newPath.endsWith("/") ? newPath.slice(0, -1) : newPath}`,
          {
            method: "PATCH",
            headers: {
              [authHeader]: `Bearer ${token}`,
            },
          },
        )
          .then((res) => res.json())
          .catch(logger.error),
    },
  })
