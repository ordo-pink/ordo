import Keycloak from "./core/auth"

const AUTH_HOST = import.meta.env.VITE_AUTH_HOST
const FS_HOST = import.meta.env.VITE_BACKEND_HOST
const LOCAL_TOKEN = import.meta.env.VITE_BACKEND_LOCAL_TOKEN

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
    if (method !== "POST" || !url.startsWith(AUTH_HOST)) {
      throw new Error("Disallowed XMLHttpRequest")
    }

    super.open(method, url, async, username, password)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.fetch = undefined as any

const host = FS_HOST.endsWith("/") ? FS_HOST.slice(0, -1) : FS_HOST

window.ordo = {
  env: {
    type: "browser",
    // TODO: Extend this to support permissions provided by the user
    fetch: (...[url, params]: Parameters<typeof fetch>) => {
      if (typeof url === "string") {
        if (!url.startsWith(FS_HOST) && !url.startsWith(AUTH_HOST)) {
          throw new Error("Invalid request")
        }
      } else if (url instanceof URL) {
        if (url.host !== FS_HOST && url.host !== AUTH_HOST) {
          throw new Error("Invalid request")
        }
      } else {
        if (!url.url.startsWith(FS_HOST) && !url.url.startsWith(AUTH_HOST)) {
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
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.text()),
        getRaw: (path) =>
          window.ordo.env.fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
            headers: {
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
            },
          }),
        getBlob: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.blob()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "DELETE",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: ({ oldPath, newPath }) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${oldPath}->${newPath}`, {
              method: "PATCH",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        update: ({ path, content }) =>
          window.ordo.env
            .fetch(`${host}/${FILE_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "PUT",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
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
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        get: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        remove: (path) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}/${Keycloak.tokenParsed?.sub}${path}`, {
              method: "DELETE",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
        move: ({ oldPath, newPath }) =>
          window.ordo.env
            .fetch(`${host}/${DIRECTORY_API}/${Keycloak.tokenParsed?.sub}${oldPath}->${newPath}`, {
              method: "PATCH",
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
              },
            })
            .then((res) => res.json()),
      },
    },
    extensions: {
      create: ({ name, content }) =>
        window.ordo.env
          .fetch(`${host}/extensions/${Keycloak.tokenParsed?.sub}/${name}`, {
            method: "POST",
            body: JSON.stringify(content),
            headers: {
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
            },
          })
          .then((res) => res.json()),
      get: (name) =>
        window.ordo.env
          .fetch(`${host}/extensions/${Keycloak.tokenParsed?.sub}/${name}`, {
            headers: {
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
            },
          })
          .then((res) => res.json()),
      remove: (name) =>
        window.ordo.env
          .fetch(`${host}/extensions/${Keycloak.tokenParsed?.sub}/${name}`, {
            method: "DELETE",
            headers: {
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
            },
          })
          .then((res) => res.json()),
      update: ({ name, content }) =>
        window.ordo.env
          .fetch(`${host}/extensions/${Keycloak.tokenParsed?.sub}/${name}`, {
            method: "PUT",
            headers: {
              [AUTHORIZATION_HEADER_KEY]: `Bearer ${LOCAL_TOKEN ?? Keycloak.token}`,
            },
            body: JSON.stringify(content),
          })
          .then((res) => res.json()),
    },
  },
}

// eslint-disable-next-line import/first
import "./web-local"
