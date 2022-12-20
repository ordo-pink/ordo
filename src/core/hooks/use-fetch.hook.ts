import { useKeycloak } from "$core/auth/hooks/use-keycloak.hook"

export const useFetch = () => {
  const { keycloak } = useKeycloak()

  return (...params: Parameters<typeof fetch>) =>
    fetch(params[0], {
      ...params[1],
      headers: {
        ...params[1]?.headers,
        Authorization: `Bearer ${keycloak.idToken}`,
      },
    }).then(async (res) => (res.ok ? res.json() : Promise.reject(await res.json())))
}
