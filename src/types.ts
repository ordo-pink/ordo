import type { RequestHandler } from "express"

import { FSDriver } from "./fs/types"

export type Logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: any) => void
}

export type AppContext = {
  fsDriver: FSDriver
  authorize: RequestHandler
  logger: Logger
}
