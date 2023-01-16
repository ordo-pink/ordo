import { UserDriver } from "$core/types"

export const protect: UserDriver["protect"] = () => (_, __, next) => next()
