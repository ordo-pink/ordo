import Keycloak from "$core/auth"

const fetch = window.fetch

const HOST = process.env.FS_API_HOST ?? "http://localhost:1337"

const DIRECTORY_API = "api/directories"
const FILE_API = "api/files"

const PATH_HEADER_KEY = "ordo-path"
const PATH_FROM_HEADER_KEY = "ordo-path-from"
const PATH_TO_HEADER_KEY = "ordo-path-to"
const AUTHORIZATION_HEADER_KEY = "authorization"

window.fetch = null as any

const host = HOST.endsWith("/") ? HOST.slice(0, -1) : HOST

// TODO: Provide access to fetch. Check request URL and request user to accept outgoing messages
window.ordo = {
  api: {
    fs: (auth: typeof Keycloak) => ({
      files: {
        create: (path) =>
          fetch(`${host}/${FILE_API}`, {
            method: "POST",
            headers: {
              [PATH_HEADER_KEY]: path,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.json()),
        get: (path) =>
          fetch(`${host}/${FILE_API}`, {
            headers: {
              [PATH_HEADER_KEY]: path,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.text()),
        remove: (path) =>
          fetch(`${host}/${FILE_API}`, {
            method: "DELETE",
            headers: {
              [PATH_HEADER_KEY]: path,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.json()),
        move: (from, to) =>
          fetch(`${host}/${FILE_API}`, {
            method: "PATCH",
            headers: {
              [PATH_FROM_HEADER_KEY]: from,
              [PATH_TO_HEADER_KEY]: to,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.json()),
        update: (path, body) =>
          fetch(`${host}/${FILE_API}`, {
            method: "PUT",
            headers: {
              [PATH_HEADER_KEY]: path,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
            body,
          }).then((res) => res.json()),
      },
      directories: {
        create: (path) =>
          fetch(`${host}/${DIRECTORY_API}`, {
            method: "POST",
            headers: {
              [PATH_HEADER_KEY]: path,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.json()),
        get: (path) =>
          fetch(`${host}/${DIRECTORY_API}`, {
            headers: {
              [PATH_HEADER_KEY]: path,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.json()),
        remove: (path) =>
          fetch(`${host}/${DIRECTORY_API}`, {
            method: "DELETE",
            headers: {
              [PATH_HEADER_KEY]: path,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.json()),
        move: (from, to) =>
          fetch(`${host}/${DIRECTORY_API}`, {
            method: "PATCH",
            headers: {
              [PATH_FROM_HEADER_KEY]: from,
              [PATH_TO_HEADER_KEY]: to,
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${auth.token}`,
            },
          }).then((res) => res.json()),
      },
    }),
  },
}

import "./web-local"
