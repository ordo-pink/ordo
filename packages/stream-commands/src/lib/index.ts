import {
  Command,
  CommandListener,
  ExecuteCommandFn,
  PayloadCommand,
  RegisterCommandFn,
} from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { Logger } from "@ordo-pink/logger"
import { equals } from "ramda"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"

type InitCommandsParams = {
  logger: Logger
}

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
  typeof cmd.type === "string" && (cmd as PayloadCommand).payload !== undefined

const addToQueue$ = new Subject<Command | PayloadCommand>()
const removeFromQueue$ = new Subject<Command | PayloadCommand>()

const addToStorage$ = new Subject<CommandListener>()
const removeFromStorage$ = new Subject<CommandListener>()

const addToQueue =
  (newCommand: Command | PayloadCommand) => (state: (Command | PayloadCommand)[]) =>
    [...state, newCommand]

const removeFromQueue =
  (command: Command | PayloadCommand) => (state: (Command | PayloadCommand)[]) => {
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

const addToStorage =
  (newListener: CommandListener) => (state: Record<string, CommandListener[1][]>) => {
    const listeners = state[newListener[0]]

    if (!listeners) {
      state[newListener[0]] = [newListener[1]]
    } else if (!listeners.some((listener) => listener.toString() === newListener[1].toString())) {
      state[newListener[0]].push(newListener[1])
    }

    return state
  }

const removeFromStorage =
  (listener: CommandListener) => (state: Record<string, CommandListener[1][]>) => {
    if (!state[listener[0]]) return state

    state[listener[0]] = state[listener[0]].filter((f) => f.toString() !== listener[1].toString())

    return state
  }

const commandQueue$ = merge(
  addToQueue$.pipe(map(addToQueue)),
  removeFromQueue$.pipe(map(removeFromQueue)),
).pipe(
  scan((acc, f) => f(acc), [] as (Command | PayloadCommand)[]),
  shareReplay(1),
)

const commandStorage$ = merge(
  addToStorage$.pipe(map(addToStorage)),
  removeFromStorage$.pipe(map(removeFromStorage)),
).pipe(
  scan((acc, f) => f(acc), {} as Record<string, CommandListener[1][]>),
  shareReplay(1),
)

const commandRunner$ = (ctx: InitCommandsParams) =>
  commandQueue$.pipe(
    combineLatestWith(commandStorage$),
    map(([commands, allListeners]) => {
      commands.forEach((command) => {
        const { type, payload } = command as PayloadCommand

        const listeners = allListeners[type]

        if (listeners) {
          removeFromQueue$.next({ type, payload })

          listeners.forEach((listener) => {
            listener({ ...ctx, payload })
          })
        }
      })
    }),
  )

export const _initCommands = callOnce((ctx: InitCommandsParams) => {
  commandRunner$(ctx).subscribe()
})

export const executeCommand: ExecuteCommandFn = <Type extends string, Payload>(
  type: Type,
  payload?: Payload,
) => {
  addToQueue$.next({ type, payload })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerCommand: RegisterCommandFn = (type, listener): any => {
  const command = [type, listener]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addToStorage$.next(command as any)

  return command
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unregisterCommand: RegisterCommandFn = (type, listener): any => {
  const command = [type, listener]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeFromStorage$.next(command as any)

  return command
}
