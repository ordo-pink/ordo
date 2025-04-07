import { Oath } from "../../oath.types"

export const unwrap_cata: Oath.Catas.Unwrap = () => ({
	reject: x => x,
	resolve: x => x,
})
