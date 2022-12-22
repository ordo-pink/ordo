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
    }).then(async (res) => {
      if (res.ok) return res

      if (res.status === 401) {
        return keycloak
          .updateToken(200)
          .then(() =>
            fetch(params[0], {
              ...params[1],
              headers: {
                ...params[1]?.headers,
                Authorization: `Bearer ${keycloak.idToken}`,
              },
            }),
          )
          .then((res) => (res.ok ? res : Promise.reject(res)))
      }

      return Promise.reject(res)
    })
}
