/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnaryFn } from "@ordo-pink/common-types"
import * as Rx from "rxjs"

// Types ------------------------------------------------------------------- //

export type CommandExecutionQueueMember<T extends [string, unknown] = [string, unknown]> = [
  T[0],
  T[1],
]

export type CommandStorageMember<T extends [string, unknown] = [string, unknown]> = [
  T[0],
  UnaryFn<T[1], void>,
]

// Command execution queue ------------------------------------------------- //

const addToQueue$ = new Rx.Subject<[string, any]>()
const removeFromQueue$ = new Rx.Subject<[string, any]>()

const add =
  <T>(value: T) =>
  (state: T[]) =>
    [...state, value]

const remove =
  <T extends [string, unknown]>(value: T) =>
  (state: T[]) =>
    state.filter((item) => item[0] !== value[0] && item[1] !== value[1])

const commandQueue$ = Rx.merge(
  addToQueue$.pipe(Rx.map(add)),
  removeFromQueue$.pipe(Rx.map(remove)),
).pipe(
  Rx.scan((acc, f) => f(acc), [] as CommandExecutionQueueMember[]),
  Rx.shareReplay(1),
)

// Store of registerred commands ------------------------------------------- //

const commandStorage$ = new Rx.Subject<[string, (arg: any) => void]>()

// Command runner ---------------------------------------------------------- //

/**
 * commandStorage$  -------C-----C-------C--->
 * commandQueue$    e---------------e----e--->
 * commandExecutor$ -------c--------c----c--->
 */
const commandExecutor$ = commandQueue$.pipe(
  Rx.combineLatestWith(
    commandStorage$.pipe(
      Rx.scan(
        (acc, v) => (acc.some((c) => c[0] === v[0]) ? acc : acc.concat([v])),
        [] as [string, (arg: unknown) => void][],
      ),
      Rx.shareReplay(1),
    ),
  ),
  Rx.map(([queue, commands]) => {
    queue.forEach(([execCommandName, execCommandPayload]) => {
      const command = commands.find((c) => {
        return c && c[0] === execCommandName
      })

      if (command) {
        const listener = command[1]

        removeFromQueue$.next([execCommandName, execCommandPayload])

        listener(execCommandPayload)
      }
    })
  }),
)

commandExecutor$.subscribe()

// API --------------------------------------------------------------------- //

export const executeCommand = <T extends [string, unknown] = [string, unknown]>(
  command: T[0],
  payload?: T[1],
) => {
  addToQueue$.next([command, payload])
}

export const registerCommand = <T extends [string, unknown] = [string, unknown]>(
  command: T[0],
  listener: (arg: T[1]) => void,
) => {
  commandStorage$.next([command, listener])
}

// TODO: Unregister command
