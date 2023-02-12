import Keycloak from "$core/auth"

const fsApiHost = process.env.REACT_APP_FS_API_HOST ?? "http://localhost:5000"
const authApiHost = process.env.REACT_APP_AUTH_API_HOST ?? "https://sso.ordo.pink"

const AUTHORIZATION_HEADER_KEY = "authorization"

const DIRECTORY_API = "fs/directories"
const FILE_API = "fs/files"

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
    if (method !== "POST" || !url.startsWith(authApiHost)) {
      throw new Error("Disallowed XMLHttpRequest")
    }

    super.open(method, url, async, username, password)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.fetch = undefined as any

const host = fsApiHost.endsWith("/") ? fsApiHost.slice(0, -1) : fsApiHost

window.ordo = {
  env: {
    type: "browser",
    // TODO: Extend this to support permissions provided by the user
    fetch: (...[url, params]: Parameters<typeof fetch>) => {
      if (typeof url === "string") {
        if (!url.startsWith(fsApiHost)) {
          throw new Error("Invalid request")
        }
      } else if (url instanceof URL) {
        if (url.host !== fsApiHost) {
          throw new Error("Invalid request")
        }
      } else {
        if (!url.url.startsWith(fsApiHost)) {
          throw new Error("Invalid request")
        }
      }

      return fetch(url, params)
    },
    openExternal: (url) => {
      window.open(url, "_blank")
    },
  },
  api: {
    fs: {
      files: {
        create: ({ path, content }) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "POST",
              body: content,
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.text()),
        getRaw: (path) =>
          window.ordo.env.fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
            headers: {
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
            },
          }),
        getBlob: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.blob()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "DELETE",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: ({ oldPath, newPath }) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${oldPath}->${newPath}`, {
              method: "PATCH",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        update: ({ path, content }) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "PUT",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
              body: content,
            })
            .then((res) => res.json()),
      },
      directories: {
        create: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "POST",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "DELETE",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: ({ oldPath, newPath }) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}/${Keycloak.tokenParsed?.sub}${oldPath}->${newPath}`, {
              method: "PATCH",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
      },
    },
  },
}

import "./web-local"
