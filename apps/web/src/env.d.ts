declare module "*.png"
declare module "*.svg"
declare module "*.jpeg"
declare module "*.jpg"
declare module "date-frequency"
declare module "@daypilot/daypilot-lite-react"

declare const APP_VERSION: string

interface ImportMeta {
  env: {
    VITE_FRONTEND_PORT: string
    VITE_BACKEND_HOST: string
    VITE_FREE_SPACE_LIMIT: string
    VITE_FREE_UPLOAD_SIZE: string
    VITE_AUTH_HOST: "https://sso.ordo.pink"
    VITE_AUTH_REALM: "test" | "master"
    VITE_AUTH_CLIENT_ID: "ordo-web-app" | "ordo-electron-app"
    VITE_BACKEND_LOCAL_TOKEN?: string
    MODE: "development" | "production" | "test"
  }
}
