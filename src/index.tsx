import Keycloak from "$core/auth"

const HOST = process.env.FS_API_HOST ?? "http://localhost:1337"

const DIRECTORY_API = "api/directories"
const FILE_API = "api/files"

const PATH_HEADER_KEY = "ordo-path"
const PATH_FROM_HEADER_KEY = "ordo-path-from"
const PATH_TO_HEADER_KEY = "ordo-path-to"
const AUTHORIZATION_HEADER_KEY = "authorization"

const fetch = window.fetch

window.XMLHttpRequest = class extends XMLHttpRequest {
  open(method: string, url: string | URL): void
  open(
    method: string,
    url: string | URL,
    async: boolean,
    username?: string | null | undefined,
    password?: string | null | undefined,
  ): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  open(method: any, url: any, async?: any, username?: any, password?: any): void {
    if (
      method !== "POST" ||
      !url.startsWith("https://sso.ordo.pink") ||
      !url.endsWith("/protocol/openid-connect/token")
    ) {
      throw new Error("Invalid request")
    }

    super.open(method, url, async, username, password)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.fetch = undefined as any

const host = HOST.endsWith("/") ? HOST.slice(0, -1) : HOST

window.ordo = {
  env: {
    type: "browser",
    // TODO: Extend this to support permissions provided by the user
    fetch: (...[url, params]: Parameters<typeof fetch>) => {
      if (typeof url === "string") {
        if (!url.startsWith(HOST)) {
          throw new Error("Invalid request")
        }
      } else if (url instanceof URL) {
        if (url.host !== HOST) {
          throw new Error("Invalid request")
        }
      } else {
        if (!url.url.startsWith(HOST)) {
          throw new Error("Invalid request")
        }
      }

      return fetch(url, params)
    },
  },
  api: {
    fs: {
      files: {
        create: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}`, {
              method: "POST",
              headers: {
                [PATH_HEADER_KEY]: path,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}`, {
              headers: {
                [PATH_HEADER_KEY]: path,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.text()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}`, {
              method: "DELETE",
              headers: {
                [PATH_HEADER_KEY]: path,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: (from, to) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}`, {
              method: "PATCH",
              headers: {
                [PATH_FROM_HEADER_KEY]: from,
                [PATH_TO_HEADER_KEY]: to,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        update: (path, body) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}`, {
              method: "PUT",
              headers: {
                [PATH_HEADER_KEY]: path,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
              body,
            })
            .then((res) => res.json()),
      },
      directories: {
        create: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}`, {
              method: "POST",
              headers: {
                [PATH_HEADER_KEY]: path,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}`, {
              headers: {
                [PATH_HEADER_KEY]: path,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}`, {
              method: "DELETE",
              headers: {
                [PATH_HEADER_KEY]: path,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: (from, to) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}`, {
              method: "PATCH",
              headers: {
                [PATH_FROM_HEADER_KEY]: from,
                [PATH_TO_HEADER_KEY]: to,
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
      },
    },
  },
}

import "./web-local"
