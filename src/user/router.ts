import { Router } from "express"
import type { Drivers } from "$core/types"

import { userRouterParams, USER_PARAM } from "$user/constants"
import { defaultResponse } from "$user/handlers/not-implemented-user-response"

const userRouter = ({ userDriver: { protect, authorize } }: Drivers) =>
  Router()
    .post(
      `/${userRouterParams.USER_LOGIN}`,

      defaultResponse,
    )
    .post(
      `/${userRouterParams.USER_LOGOUT}`,

      protect(["admin", "user"]),
      authorize,
      defaultResponse,
    )
    .post(
      `/${userRouterParams.USER_SIGNUP}`,

      defaultResponse,
    )
    .post(
      `/${userRouterParams.USER_CHANGE_USERNAME}`,

      protect(["admin", "user"]),
      authorize,
      defaultResponse,
    )
    .post(
      `/${userRouterParams.USER_CHANGE_EMAIL}`,

      protect(["admin", "user"]),
      authorize,
      defaultResponse,
    )
    .post(
      `/${userRouterParams.USER_CHANGE_PASSWORD}`,

      protect(["admin", "user"]),
      authorize,
      defaultResponse,
    )
    .post(
      `/${userRouterParams.USER_LINK_ACCOUNT}`,

      protect(["admin", "user"]),
      authorize,
      defaultResponse,
    )

export default (drivers: Drivers) => Router().use(`/${USER_PARAM}`, userRouter(drivers))
