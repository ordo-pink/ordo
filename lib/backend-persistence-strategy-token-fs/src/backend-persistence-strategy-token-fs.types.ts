import type { TPersistenceStrategyToken } from "@ordo-pink/backend-service-token"

export type TPersistenceStrategyTokenFSStatic = {
	of: (path: string) => TPersistenceStrategyToken
}
