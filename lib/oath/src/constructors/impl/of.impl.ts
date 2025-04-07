import { type Oath } from "../../oath.types"
import { create } from "./create.impl"

export const resolve: Oath.Constructors.Resolve = x => create(res => res(x))

export const reject: Oath.Constructors.Reject = x => create((_, rej) => rej(x))

export const empty: Oath.Constructors.Empty = () => create(res => res(void 0))
