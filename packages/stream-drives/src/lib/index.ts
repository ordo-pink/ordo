import { FSDriver, Nullable, OrdoDrive, UnaryFn, UserInfo } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { Directory } from "@ordo-pink/fs-entity"
import { BehaviorSubject, map, Observable } from "rxjs"

export const drive$ = new BehaviorSubject<Nullable<OrdoDrive>>(null)
export const fsDriver$ = new BehaviorSubject<Nullable<FSDriver>>(null)

export const _initDrives = callOnce(
  (
    user$: Observable<UserInfo>,
    createFsDriver: UnaryFn<{ token: string; sub: string }, FSDriver>,
  ) => {
    user$
      .pipe(
        map((info) =>
          info.auth.isAuthenticated
            ? createFsDriver({
                token: info.auth.credentials.token as string,
                sub: info.auth.credentials.sub,
              })
            : null,
        ),
        map((driver) => {
          if (!driver) return

          fsDriver$.next(driver)

          driver.directories.get("/").then((raw) => {
            drive$.next({
              // TODO: Get params from user
              params: { maxTotalSize: 50, maxUploadSize: 5 },
              root: Directory.from(raw),
            })
          })
        }),
      )
      .subscribe()
  },
)
