import {
  Command,
  CommandListener,
  ExecuteCommandFn,
  PayloadCommand,
  RegisterCommandFn,
  ThunkFn,
  UnaryFn,
} from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { equals } from "ramda"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
  typeof cmd.type === "string" && (cmd as PayloadCommand).payload !== undefined

const addToQueue$ = new Subject<Command | PayloadCommand>()
const removeFromQueue$ = new Subject<Command | PayloadCommand>()

const add = (newCommand: Command | PayloadCommand) => (state: (Command | PayloadCommand)[]) =>
  [...state, newCommand]

const remove = (command: Command | PayloadCommand) => (state: (Command | PayloadCommand)[]) => {
  const targetHasPayload = isPayloadCommand(command)

  return state.filter((cmd) => {
    const currentHasPayload = isPayloadCommand(cmd)

    const bothHaveNoPayload = !targetHasPayload && !currentHasPayload
    const bothHavePayload = targetHasPayload && currentHasPayload

    const typesMatch = command.type === cmd.type

    return !(
      typesMatch &&
      (bothHaveNoPayload || (bothHavePayload && equals(command.payload, cmd.payload)))
    )
  })
}

const commandQueue$ = merge(addToQueue$.pipe(map(add)), removeFromQueue$.pipe(map(remove))).pipe(
  scan((acc, f) => f(acc), [] as (Command | PayloadCommand)[]),
  shareReplay(1),
)

const commandStorage$ = new Subject<CommandListener>()

const commandRunner$ = commandQueue$.pipe(
  combineLatestWith(
    commandStorage$.pipe(
      scan(
        (acc, v) => (acc.some((c) => c[0] === v[0]) ? acc : acc.concat([v])),
        [] as CommandListener[],
      ),
      map((listeners) => {
        const cleanListeners = [] as CommandListener[]

        listeners.forEach((listener) => {
          if (!cleanListeners.some((l) => l[0] === listener[0])) {
            cleanListeners.push(listener)
          }
        })

        return cleanListeners
      }),
      shareReplay(1),
    ),
  ),
  map(([commands, listeners]) => {
    commands.forEach((command) => {
      const { type, payload } = command as PayloadCommand

      const commandListener = listeners.find(
        (listener) => listener && listener[0] === type,
      ) as CommandListener<string, unknown>

      if (commandListener) {
        removeFromQueue$.next({ type, payload })
        const listener = commandListener[1]
        listener(payload)
      }
    })
  }),
)

export const _initCommands = callOnce(() => {
  commandRunner$.subscribe()
})

export const executeCommand: ExecuteCommandFn = <Type extends string, Payload>(
  type: Type,
  payload?: Payload,
) => {
  addToQueue$.next({ type, payload })
}

export const registerCommand: RegisterCommandFn = <Payload, Type extends string = string>(
  type: Type,
  listener: Payload extends void
    ? ThunkFn<void | Promise<void>>
    : UnaryFn<Payload, void | Promise<void>>,
) => {
  const command = [type, listener as ThunkFn<void>] as [Type, Payload]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commandStorage$.next(command as any)

  return command
}
