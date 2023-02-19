import Keycloak from "keycloak-js"

const url = import.meta.env.VITE_AUTH_HOST ?? "https://sso.ordo.pink"
const realm = import.meta.env.VITE_AUTH_REALM ?? "test"
const clientId = import.meta.env.VITE_AUTH_CLIENT_ID ?? "ordo-web-app"

export default new Keycloak({ url, realm, clientId })
