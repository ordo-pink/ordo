import { useState } from "react"

import { useFetch } from "$core/hooks/use-fetch.hook"
import { OrdoDirectory, OrdoFile } from "$core/types"

const HOST = process.env.FS_API_HOST ?? "http://localhost:1337"

const DIRECTORY_API = "api/directories"
const FILE_API = "api/files"

const PATH_HEADER_KEY = "ordo-path"
const PATH_FROM_HEADER_KEY = "ordo-path-from"
const PATH_TO_HEADER_KEY = "ordo-path-to"

export const useFSAPI = () => {
  const fetch = useFetch()
  const [host] = useState(HOST.endsWith("/") ? HOST.slice(0, -1) : HOST)

  return {
    files: {
      create: (path: string): Promise<OrdoFile> =>
        fetch(`${host}/${FILE_API}`, {
          method: "POST",
          headers: { [PATH_HEADER_KEY]: path },
        }).then((res) => res.json()),
      get: (path: string): Promise<string> =>
        fetch(`${host}/${FILE_API}`, {
          headers: { [PATH_HEADER_KEY]: path },
        }).then((res) => res.text()),
      archive: (path: string) =>
        fetch(`${host}/${FILE_API}`, {
          method: "DELETE",
          headers: { [PATH_HEADER_KEY]: path },
        }).then((res) => res.json()),
      move: (from: string, to: string): Promise<OrdoFile> =>
        fetch(`${host}/${FILE_API}`, {
          method: "PATCH",
          headers: {
            [PATH_FROM_HEADER_KEY]: from,
            [PATH_TO_HEADER_KEY]: to,
          },
        }).then((res) => res.json()),
      save: (path: string, body: string): Promise<OrdoFile> =>
        fetch(`${host}/${FILE_API}`, {
          method: "PUT",
          headers: { [PATH_HEADER_KEY]: path },
          body,
        }).then((res) => res.json()),
    },
    directories: {
      create: (path: string): Promise<OrdoDirectory> =>
        fetch(`${host}/${DIRECTORY_API}`, {
          method: "POST",
          headers: { [PATH_HEADER_KEY]: path },
        }).then((res) => res.json()),
      get: (path: string): Promise<OrdoDirectory> =>
        fetch(`${host}/${DIRECTORY_API}`, {
          headers: { [PATH_HEADER_KEY]: path },
        }).then((res) => res.json()),
      archive: (path: string) =>
        fetch(`${host}/${DIRECTORY_API}`, {
          method: "DELETE",
          headers: { [PATH_HEADER_KEY]: path },
        }).then((res) => res.json()),
      move: (from: string, to: string): Promise<OrdoDirectory> =>
        fetch(`${host}/${DIRECTORY_API}`, {
          method: "PATCH",
          headers: {
            [PATH_FROM_HEADER_KEY]: from,
            [PATH_TO_HEADER_KEY]: to,
          },
        }).then((res) => res.json()),
    },
  }
}
