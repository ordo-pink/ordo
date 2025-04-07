import { reject, resolve } from "./of.impl"
import { type Oath } from "../../oath.types"

export const tryy: Oath.Constructors.Try = (tryer, catcher) => {
	try {
		return resolve(tryer())
	} catch (e) {
		return catcher ? reject(catcher(e as any)) : (reject(e) as any)
	}
}
