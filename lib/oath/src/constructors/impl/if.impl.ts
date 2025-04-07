import { reject, resolve } from "./of.impl"
import { type Oath } from "../../oath.types"

export const iif: Oath.Constructors.If = (condition, explosion) =>
	condition ? resolve(explosion?.on_true?.()) : (reject(explosion?.on_false?.()) as any)
