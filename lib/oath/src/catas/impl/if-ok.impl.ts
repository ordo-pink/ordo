import { Oath } from "../../oath.types"

export const if_ok_cata: Oath.Catas.IfOk = resolve => ({
	reject: () => void 0,
	resolve,
})
