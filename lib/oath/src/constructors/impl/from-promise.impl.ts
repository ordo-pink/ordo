import { Oath } from "../../oath.types"
import { create } from "./create.impl"

export const from_promise: Oath.Constructors.FromPromise = f => create((resolve, reject) => f().then(resolve, reject))
