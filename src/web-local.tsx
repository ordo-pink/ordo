import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { RouterProvider } from "react-router-dom"

import Keycloak from "$core/auth"
import { ReactKeycloakProvider } from "$core/auth/provider"
import Loading from "$core/components/loading"
import { router } from "$core/router"
import { store } from "$core/state"

import "$assets/index.css"

Keycloak.init({
  onLoad: "login-required",
}).then(() => {
  window.ordo.env.isAuthenticated = true
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement)

  root.render(
    <ReactKeycloakProvider
      authClient={Keycloak}
      LoadingComponent={<Loading />}
      // onEvent={(type, error) => console.log(type, error)}
      // onTokens={(tokens) => console.log(tokens)}
    >
      <Provider store={store}>
        <RouterProvider
          router={router}
          fallbackElement={<Loading />}
        />
      </Provider>
    </ReactKeycloakProvider>,
  )
})
