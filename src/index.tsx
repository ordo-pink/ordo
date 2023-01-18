import Keycloak from "$core/auth"

const HOST = process.env.REACT_APP_FS_API_HOST ?? "http://localhost:5000"
const FAKE_TOKEN = process.env.REACT_APP_FAKE_TOKEN

const DIRECTORY_API = "fs/directories"
const FILE_API = "fs/files"

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
            .fetch(`${host}/${FILE_API}${path}`, {
              method: "POST",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.text()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}${path}`, {
              method: "DELETE",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: (from, to) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}${from}->${to}`, {
              method: "PATCH",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        update: (path, body) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}${path}`, {
              method: "PUT",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
              body,
            })
            .then((res) => res.json()),
      },
      directories: {
        create: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}${path}`, {
              method: "POST",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}${path}`, {
              method: "DELETE",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: (from, to) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}${from}->${to}`, {
              method: "PATCH",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${FAKE_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
      },
    },
  },
}

import "./web-local"
