import Keycloak from "keycloak-js"

export default new Keycloak({
  url: "https://sso.ordo.pink",
  realm: "test",
  clientId: "ordo-web-app",
})
