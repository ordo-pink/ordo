import { useKeycloak } from "$core/auth/hooks/use-keycloak.hook"

export const useFSAPI = () => {
  const { keycloak } = useKeycloak()

  return window.ordo.api.fs(keycloak)
}
