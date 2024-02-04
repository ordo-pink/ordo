// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Logger } from "@ordo-pink/logger"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"
import { equals } from "ramda"
import { callOnce } from "@ordo-pink/tau"
import { nanoid } from "nanoid"
import { useMemo } from "react"

/**
 * Entrypoint for using commands. You can use this function outside React components.
 */
export const getCommands = (): Client.Commands.Commands => ({
	on: (name, handler) => add$.next([name, handler]),
	off: (name, handler) => remove$.next([name, handler]),
	emit: (name, payload?, key = nanoid()) => enqueue$.next({ name, payload, key }),
	cancel: (name, payload?, key = nanoid()) => dequeue$.next({ name, payload, key }),
	before: (name, handler) => addBefore$.next([name, handler]),
})

/**
 * A React hook for accessing commands.
 */
export const useCommands = () => {
	const commands = useMemo(() => getCommands(), [])
	return commands
}

// --- Internal ---

type Command = Client.Commands.Command | Client.Commands.PayloadCommand
type CmdHandlerState = Record<string, Client.Commands.Handler<any>[]>
type CmdListener<N extends Client.Commands.CommandName = Client.Commands.CommandName, P = any> = [
	N,
	Client.Commands.Handler<P>,
]

type InitCommandsP = { logger: Logger }
export const __initCommands = callOnce(({ logger }: InitCommandsP): void => {
	logger.debug("Initializing commands")

	commandQueue$
		.pipe(
			combineLatestWith(commandStorage$),
			map(([commands, allListeners]) => {
				commands.forEach(command => {
					const { name, payload } = command as Client.Commands.PayloadCommand

					const listeners = allListeners[name]

					if (listeners) {
						dequeue$.next({ name, payload })

						logger.debug(
							`Command ${name} invoked for ${listeners.length} listeners, payload: `,
							payload,
						)

						listeners.forEach(listener => {
							listener({ logger, payload })
						})
					} else {
						logger.notice(
							`No handler found for the command "${name}". The command will stay pending until handler is registerred.`,
						)
					}
				})
			}),
		)
		.subscribe()
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
const add$ = new Subject<CmdListener>()
const addBefore$ = new Subject<CmdListener>()
const remove$ = new Subject<CmdListener>()
const commandQueue$ = merge(enqueue$.pipe(map(enqueue)), dequeue$.pipe(map(dequeue))).pipe(
	scan((acc, f) => f(acc), [] as (Client.Commands.Command | Client.Commands.PayloadCommand)[]),
	shareReplay(1),
)

const commandStorage$ = merge(
	add$.pipe(map(addAfter)),
	addBefore$.pipe(map(addBefore)),
	remove$.pipe(map(remove)),
).pipe(
	scan((acc, f) => f(acc), {} as Record<string, CmdListener[1][]>),
	shareReplay(1),
)
