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

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement)

root.render(
  <ReactKeycloakProvider
    authClient={Keycloak}
    autoRefreshToken
    LoadingComponent={<Loading />}
    onEvent={(_, error) => {
      // eslint-disable-next-line no-console
      if (error) console.error(error)
    }}
  >
    <Helmet>
      <title>{"Ordo.pink"}</title>
    </Helmet>

    <Provider store={store}>
      <RouterProvider
        router={router}
        fallbackElement={<Loading />}
      />
    </Provider>
  </ReactKeycloakProvider>,
)
// })
