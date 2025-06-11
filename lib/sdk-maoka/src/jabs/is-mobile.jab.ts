import type { Maoka } from "@ordo-pink/maoka"

export const is_mobile_jab: Maoka.Jab<boolean> = () =>
	["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "IEMobile", "Opera Mini"].some(platform =>
		navigator.userAgent.includes(platform),
	)
