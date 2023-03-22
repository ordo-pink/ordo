import { AuthInfo, FSDriver } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { map, Observable } from "rxjs"

export const _initDrives = callOnce(
  (auth$: Observable<AuthInfo>, createFsDriver: (token: string) => FSDriver) => {
    auth$.pipe(
      map((info) =>
        info.isAuthenticated ? createFsDriver(info.credentials.token as string) : null,
      ),
    )
  },
)
