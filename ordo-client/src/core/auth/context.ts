import type Keycloak from "keycloak-js"
import { createContext } from "react"

import type { AuthClient } from "$core/auth/types"

/**
 * Auth Context props
 */
export type IAuthContextProps<T extends AuthClient> = {
  /**
   * The single AuthClient of your application.
   */
  authClient?: T

  /**
   * Boolean indicating whenever the AuthClient has been initialized by AuthProvider
   */
  initialized: boolean
}

/**
 * Create a React context containing an AuthClient instance.
 *
 * @param {IAuthContextProps} initialContext initial context value.
 *
 * @returns {React.Context} the ReactKeycloak context.
 */
export function createAuthContext<T extends AuthClient>(
  initialContext?: Partial<IAuthContextProps<T>>,
): React.Context<IAuthContextProps<T>> {
  return createContext({
    initialized: false,
    ...initialContext,
  })
}

export const reactKeycloakWebContext = createAuthContext<Keycloak>()

export const ReactKeycloakWebContextConsumer = reactKeycloakWebContext.Consumer

export default createAuthContext
