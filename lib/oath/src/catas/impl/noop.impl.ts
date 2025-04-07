import { Oath } from "../../oath.types"

export const noop_cata: Oath.Catas.Noop = () => ({
	reject: () => void 0,
	resolve: () => void 0,
})
