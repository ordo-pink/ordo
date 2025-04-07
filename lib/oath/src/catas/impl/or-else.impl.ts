import { type Oath } from "../../oath.types"

export const or_else_cata: Oath.Catas.OrElse = reject => ({
	reject,
	resolve: x => x,
})
