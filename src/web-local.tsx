import ReactDOM from "react-dom/client"
import { Helmet } from "react-helmet"
import { Provider } from "react-redux"
import { RouterProvider } from "react-router-dom"

import Keycloak from "$core/auth"
import { ReactKeycloakProvider } from "$core/auth/provider"
import Loading from "$core/components/loading"
import { router } from "$core/router"
import { store } from "$core/state"

import "$assets/index.css"

Keycloak.init({
  onLoad: "check-sso",
}).then((isAuthenticated) => {
  window.ordo.env.isAuthenticated = isAuthenticated

  const token = Keycloak.tokenParsed

  if (token) {
    window.ordo.env.isAuthenticated = true

    window.ordo.env.userData = {
      email: token.email,
      emailVerified: token.email_verified,
      firstName: token.given_name,
      lastName: token.family_name,
      fullName: token.name,
      username: token.preferred_username,
    }

    Keycloak.onTokenExpired = () => {
      if (Keycloak.refreshToken) {
        Keycloak.updateToken(60 * 30)
      }
    }
  }

  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement)

  root.render(
    <ReactKeycloakProvider
      authClient={Keycloak}
      LoadingComponent={<Loading />}
      onEvent={(_, error) => {
        // eslint-disable-next-line no-console
        if (error) console.error(error)
      }}
      // onTokens={(tokens) => console.log(tokens)}
    >
      <Provider store={store}>
        <RouterProvider
          router={router}
          fallbackElement={<Loading />}
        />
      </Provider>

      <Helmet>
        <title>{"Ordo.pink"}</title>
      </Helmet>
    </ReactKeycloakProvider>,
  )
})
