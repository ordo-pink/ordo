import Keycloak from "keycloak-js"

const url = process.env.REACT_APP_AUTH_API_HOST ?? "https://sso.ordo.pink"
const realm = process.env.REACT_APP_AUTH_API_REALM ?? "test"
const clientId = process.env.REACT_APP_AUTH_CLIENT_ID ?? "ordo-web-app"

export default new Keycloak({
  url,
  realm,
  clientId,
})
