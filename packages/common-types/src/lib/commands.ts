import { Logger } from "@ordo-pink/logger"
import type { BinaryFn, UnaryFn } from "./types"

export type Command<Type extends string = string> = {
  type: Type
}

export type PayloadCommand<Type extends string = string, Payload = unknown> = Command<Type> & {
  payload: Payload
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandContext<Payload = any> = {
  logger: Logger
  payload: Payload
}

export type CommandHandler<Payload> = UnaryFn<CommandContext<Payload>, void | Promise<void>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandListener<Type extends string = string, Payload = any> = [
  Type,
  CommandHandler<Payload>,
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterredCommand<Payload = any, Type extends string = string> = [
  Type,
  CommandHandler<Payload>,
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterCommandFn<Payload = any, Type extends string = string> = UnaryFn<
  string,
  BinaryFn<Type, CommandHandler<Payload>, RegisterredCommand<Payload, Type>>
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExecuteCommandFn<Type extends string = string, Payload = any> = (
  type: Type,
  payload?: Payload,
) => void
