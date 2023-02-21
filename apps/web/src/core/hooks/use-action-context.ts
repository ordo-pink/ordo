import { useKeycloak } from "@ordo-pink/keycloak"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useEnv } from "./use-env"
import { useAppDispatch } from "../state/hooks/use-app-dispatch"
import { useRootState } from "../state/hooks/use-root-state"
import { ActionContext } from "../types"

export const useActionContext = (
  contextMenuTarget: ActionContext["contextMenuTarget"] = null,
): ActionContext => {
  const dispatch = useAppDispatch()
  const state = useRootState()
  const { keycloak } = useKeycloak()
  const env = useEnv()
  const navigate = useNavigate()
  const { t } = useTranslation()

  let userData

  const tokenParsed = keycloak.tokenParsed

  if (tokenParsed) {
    userData = {
      email: tokenParsed.email,
      emailVerified: tokenParsed.email_verified,
      username: tokenParsed.preferred_username,
    }
  }

  return {
    dispatch,
    env,
    state,
    contextMenuTarget,
    isAuthenticated: keycloak.authenticated,
    createLoginUrl: () => keycloak.createLoginUrl({ redirectUri: "/editor" }),
    createRegisterUrl: () => keycloak.createRegisterUrl({ redirectUri: "/editor" }),
    navigate,
    translate: t,
    userData,
  } as ActionContext
}
