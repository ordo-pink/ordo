// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Subject, combineLatestWith, map, merge, scan, shareReplay } from "rxjs"
import { equals } from "ramda"
import { nanoid } from "nanoid"
import { useMemo } from "react"

import type { Logger } from "@ordo-pink/logger"
import { callOnce } from "@ordo-pink/tau"
import { useSharedContext } from "@ordo-pink/frontend-react-hooks"
import { getLogger } from "@ordo-pink/frontend-logger"
import { Either } from "@ordo-pink/either"

/**
 * Entrypoint for using commands. You can use this function outside React components.
 */
export const getCommands = (fid: symbol | null): Client.Commands.Commands =>
	Either.fromNullable(fid)
		.leftMap(() => getLogger(fid))
		.fold(
			logger => ({
				on: () => logger.alert("Registerring commands disallowed."),
				off: () => logger.alert("Unregisterring commands disallowed."),
				after: () => logger.alert("Registerring commands disallowed."),
				before: () => logger.alert("Registerring commands disallowed."),
				emit: () => logger.alert("Emitting commands disallowed."),
				cancel: () => logger.alert("Cancelling commands disallowed."),
			}),
			fid => ({
				on: (name, handler) => addAfter$.next([name, handler, fid]),
				off: (name, handler) => remove$.next([name, handler, fid]),
				after: (name, handler) => addAfter$.next([name, handler, fid]),
				before: (name, handler) => addBefore$.next([name, handler, fid]),
				emit: (name, payload?, key = nanoid()) => enqueue$.next({ name, payload, key, fid }),
				cancel: (name, payload?, key = nanoid()) => dequeue$.next({ name, payload, key, fid }),
			}),
		)

/**
 * A React hook for accessing commands.
 * // TODO: Move all hooks to frontend-react-hooks
 */
export const useCommands = () => {
	const { fid: thisFunction } = useSharedContext()
	const commands = useMemo(() => getCommands(thisFunction), [])
	return commands
}

// --- Internal ---

type Command = (Client.Commands.Command | Client.Commands.PayloadCommand) & { fid: symbol }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CmdHandlerState = Record<string, Client.Commands.Handler<any>[]>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CmdListener<N extends Client.Commands.CommandName = Client.Commands.CommandName, P = any> = [
	N,
	Client.Commands.Handler<P>,
	symbol,
]

export const __initCommands = callOnce((fid: symbol) => {
	const logger = getLogger(fid)

	logger.debug("Initializing commands...")

	commandQueue$
		.pipe(
			combineLatestWith(commandStorage$),
			map(async ([commands, allListeners]) => {
				for (const command of commands) {
					const name = command.name
					const fid = command.fid
					const payload = isPayloadCommand(command) ? (command.payload as unknown) : undefined

					const logger = getLogger(fid)

					const listeners = allListeners[name]

					if (listeners) {
						dequeue$.next({ name, payload, fid })

						logger.debug(
							`Command "${name}" invoked for ${listeners.length} ${listeners.length === 1 ? "listener" : "listeners"}. Provided payload: `,
						)
						logger.debug(payload)

						for (const listener of listeners) {
							await listener({ logger, payload })
						}
					} else {
						logger.warn(
							`No handler found for the command "${name}". The command will stay pending until handler is registerred.`,
						)
					}
				}
			}),
		)
		.subscribe()

	logger.debug("Initialised commands.")
})

const isPayloadCommand = (cmd: Client.Commands.Command): cmd is Client.Commands.PayloadCommand =>
	typeof cmd.name === "string" && (cmd as Client.Commands.PayloadCommand).payload !== undefined

type Enqueue = (cmd: Command) => (state: Command[]) => Command[]
const enqueue: Enqueue = newCommand => state =>
	state.some(cmd => cmd.key === newCommand.key) ? state : [...state, newCommand]

type Dequeue = (cmd: Command) => (state: Command[]) => Command[]
const dequeue: Dequeue = command => state => {
	if (state.some(cmd => cmd.key === command.key))
		return state.filter(cmd => cmd.key === command.key)

	const targetHasPayload = isPayloadCommand(command)

	return state.filter(cmd => {
		const currentHasPayload = isPayloadCommand(cmd)

		const bothHaveNoPayload = !targetHasPayload && !currentHasPayload
		const bothHavePayload = targetHasPayload && currentHasPayload

		const namesMatch = command.name === cmd.name

		return !(
			namesMatch &&
			(bothHaveNoPayload || (bothHavePayload && equals(command.payload, cmd.payload)))
		)
	})
}

type Add = (listener: CmdListener) => (state: Record<string, CmdListener[1][]>) => CmdHandlerState
const addBefore: Add = newListener => state => {
	const listeners = state[newListener[0]]

	if (!listeners) {
		state[newListener[0]] = [newListener[1]]
	} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
		state[newListener[0]].unshift(newListener[1])
	}

	return state
}

const addAfter: Add = newListener => state => {
	const listeners = state[newListener[0]]

	if (!listeners) {
		state[newListener[0]] = [newListener[1]]
	} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
		state[newListener[0]].push(newListener[1])
	}

	return state
}

type Remove = (
	listener: CmdListener,
) => (state: Record<string, CmdListener[1][]>) => CmdHandlerState
const remove: Remove = listener => state => {
	if (!state[listener[0]]) return state

	state[listener[0]] = state[listener[0]].filter(f => f.toString() !== listener[1].toString())

	return state
}

const enqueue$ = new Subject<Command>()
const dequeue$ = new Subject<Command>()
const addAfter$ = new Subject<CmdListener>()
const addBefore$ = new Subject<CmdListener>()
const remove$ = new Subject<CmdListener>()
const commandQueue$ = merge(enqueue$.pipe(map(enqueue)), dequeue$.pipe(map(dequeue))).pipe(
	scan(
		(acc, f) => f(acc),
		[] as ((Client.Commands.Command | Client.Commands.PayloadCommand) & { fid: symbol })[],
	),
	shareReplay(1),
)

const commandStorage$ = merge(
	addAfter$.pipe(map(addAfter)),
	addBefore$.pipe(map(addBefore)),
	remove$.pipe(map(remove)),
).pipe(
	scan((acc, f) => f(acc), {} as Record<string, CmdListener[1][]>),
	shareReplay(1),
)
