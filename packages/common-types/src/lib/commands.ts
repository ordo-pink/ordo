import type { BinaryFn, ThunkFn, UnaryFn } from "./types"

export type Command<Type extends string = string> = {
  type: Type
}

export type PayloadCommand<Type extends string = string, Payload = unknown> = {
  type: Type
  payload: Payload
}

export type CommandListener<Type extends string = string, Payload = unknown> = [
  Type,
  Payload extends void ? ThunkFn<void | Promise<void>> : UnaryFn<Payload, void | Promise<void>>,
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterCommandFn<Payload = any, Type extends string = string> = BinaryFn<
  Type,
  Payload extends void ? ThunkFn<void> : UnaryFn<Payload, void>,
  [Type, Payload extends void ? ThunkFn<void> : UnaryFn<Payload, void>]
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExecuteCommandFn<Type extends string = string, Payload = any> = BinaryFn<
  Type,
  Payload,
  void
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListenCommandFn<Payload = any, Type extends string = string> = BinaryFn<
  Type,
  Payload extends void ? ThunkFn<void> : UnaryFn<Payload, void>,
  void
>
