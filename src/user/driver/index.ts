import { UserDriver } from "$core/types"

import { authorize } from "$user/driver/methods/authorize"
import { protect } from "$user/driver/methods/protect"

export const createDefaultUserDriver = (token: string): UserDriver => ({
  protect: protect,
  authorize: authorize(token),
})
