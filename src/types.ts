import { UnaryFn } from "@ordo-pink/core"
import cors from "cors"
import express, { RequestHandler } from "express"
import { FSDriver, Params } from "./fs/types"

export type Logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: any) => void
}

export type Drivers = {
  fs: FSDriver
}

export type CreateOrdoBackendServerParams = {
  drivers: Drivers
  prependMiddleware?: UnaryFn<ReturnType<typeof express>, ReturnType<typeof express>>
  corsOptions?: Parameters<typeof cors>[0]
  authorize: RequestHandler<Params<Record<string, unknown>>>
  logger: Logger
}
