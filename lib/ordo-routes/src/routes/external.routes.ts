import { ExternalEndpoints, OrdoRouteMap } from "../ordo-routes.types"

const method = "GET"
const authenticated = false
const createHandler = () => ({} as any)
const GITHUB_SOURCE = "https://github.com/ordo-pink"
const GITHUB_LICENSE = "https://github.com/ordo-pink/ordo/blob/main/root/legal/license.md"
const X_COM_ACCOUNT = "https://x.com/ordo_pink"
const TG_SUPPORT_CIS = "https://t.me/ordo_pink_ru"

export const External: OrdoRouteMap<ExternalEndpoints> = {
	SourceCode: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: GITHUB_SOURCE }),
	},
	TwitterX: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: X_COM_ACCOUNT }),
	},
	TelegramSupportCIS: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: TG_SUPPORT_CIS }),
	},
	License: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: GITHUB_LICENSE }),
	},
}
