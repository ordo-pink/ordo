import { Logger } from "@ordo-pink/logger"
import type { BinaryFn, UnaryFn } from "./types"

export type Command<Type extends string = string> = {
  type: Type
}

export type PayloadCommand<Type extends string = string, Payload = unknown> = {
  type: Type
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
export type RegisterCommandFn<Payload = any, Type extends string = string> = BinaryFn<
  Type,
  CommandHandler<Payload>,
  CommandHandler<Payload>
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExecuteCommandFn<Type extends string = string, Payload = any> = BinaryFn<
  Type,
  Payload,
  void
>
