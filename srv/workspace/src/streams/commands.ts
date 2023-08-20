// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Logger } from "@ordo-pink/logger"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"
import { equals } from "ramda"
import { Binary, callOnce, Curry, Unary } from "@ordo-pink/tau"

// --- Public ---

/**
 * Command name.
 */
export type CmdName = `${string}.${string}`

/**
 * Command without payload.
 */
export type Cmd<N extends CmdName = CmdName> = { name: N }

/**
 * Command with payload.
 */
export type PayloadCmd<N extends CmdName = CmdName, P = any> = Cmd<N> & { payload: P }

/**
 * Context provided to command handler.
 */
export type CmdCtx<P = any> = { logger: Logger; payload: P }

/**
 * Command handler.
 */
export type CmdHandler<P> = Unary<CmdCtx<P>, any>

/**
 * Entrypoint for using commands.
 */
export const getCommands = () => ({
	/**
	 * Append a listener to a given command.
	 */
	on: <
		T extends { name: `${string}.${string}`; payload?: any } = {
			name: `${string}.${string}`
			payload: any
		}
	>(
		name: T extends { name: infer U; payload?: any } ? U : never,
		handler: CmdHandler<T extends { name: any; payload?: infer U } ? U : never>
	) => add$.next([name, handler]),

	/**
	 * Remove given listener for a given command. Make sure you provide a reference to the same
	 * function as you did when calling `on`.
	 */
	off: <
		T extends { name: `${string}.${string}`; payload?: any } = {
			name: `${string}.${string}`
			payload: any
		}
	>(
		name: T extends { name: infer U; payload?: any } ? U : never,
		handler: CmdHandler<T extends { name: any; payload?: infer U } ? U : never>
	) => remove$.next([name, handler]),

	/**
	 * Emit given command with given payload.
	 */
	emit: <
		T extends { name: `${string}.${string}`; payload?: any } = {
			name: `${string}.${string}`
			payload?: any
		}
	>(
		name: T extends { name: infer U; payload?: any } ? U : never,
		payload?: T extends { name: any; payload: infer U } ? U : never
	) => enqueue$.next({ name, payload } as any),

	/**
	 * Prepend listener to a given command.
	 */
	before: <
		T extends { name: `${string}.${string}`; payload: any } = {
			name: `${string}.${string}`
			payload: any
		}
	>(
		name: T extends { name: infer U; payload: any } ? U : never,
		handler: CmdHandler<T extends { name: any; payload: infer U } ? U : never>
	) => addBefore$.next([name, handler]),
})

// --- Internal ---

export const __initCommands: InitCommands = callOnce(({ logger }) => {
	logger.debug("Initializing commands")

	commandRunner$({ logger }).subscribe()
})

type InitCommandsP = { logger: Logger }
type InitCommands = Unary<InitCommandsP, void>
type Command = Cmd | PayloadCmd
type EnqueueP = Curry<Binary<Command, Command[], Command[]>>
type DequeueP = Curry<Binary<Command, Command[], Command[]>>
type CmdHandlerState = Record<string, CmdHandler<any>[]>
type CmdListener<N extends CmdName = CmdName, P = any> = [N, CmdHandler<P>]
type AddP = Curry<Binary<CmdListener, Record<string, CmdListener[1][]>, CmdHandlerState>>
type RemoveP = Curry<Binary<CmdListener, Record<string, CmdListener[1][]>, CmdHandlerState>>

const isPayloadCmd = (cmd: Cmd): cmd is PayloadCmd =>
	typeof cmd.name === "string" && (cmd as PayloadCmd).payload !== undefined

const enqueueP: EnqueueP = newCommand => state => [...state, newCommand]
const dequeueP: DequeueP = command => state => {
	const targetHasPayload = isPayloadCmd(command)

	return state.filter(cmd => {
		const currentHasPayload = isPayloadCmd(cmd)

		const bothHaveNoPayload = !targetHasPayload && !currentHasPayload
		const bothHavePayload = targetHasPayload && currentHasPayload

		const namesMatch = command.name === cmd.name

		return !(
			namesMatch &&
			(bothHaveNoPayload || (bothHavePayload && equals(command.payload, cmd.payload)))
		)
	})
}

const addBeforeP: AddP = newListener => state => {
	const listeners = state[newListener[0]]

	if (!listeners) {
		state[newListener[0]] = [newListener[1]]
	} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
		state[newListener[0]].unshift(newListener[1])
	}

	return state
}

const addP: AddP = newListener => state => {
	const listeners = state[newListener[0]]

	if (!listeners) {
		state[newListener[0]] = [newListener[1]]
	} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
		state[newListener[0]].push(newListener[1])
	}

	return state
}

const removeP: RemoveP = listener => state => {
	if (!state[listener[0]]) return state

	state[listener[0]] = state[listener[0]].filter(f => f.toString() !== listener[1].toString())

	return state
}

const enqueue$ = new Subject<Command>()
const dequeue$ = new Subject<Command>()
const add$ = new Subject<CmdListener>()
const addBefore$ = new Subject<CmdListener>()
const remove$ = new Subject<CmdListener>()
const commandQueue$ = merge(enqueue$.pipe(map(enqueueP)), dequeue$.pipe(map(dequeueP))).pipe(
	scan((acc, f) => f(acc), [] as (Cmd | PayloadCmd)[]),
	shareReplay(1)
)

const commandStorage$ = merge(
	add$.pipe(map(addP)),
	addBefore$.pipe(map(addBeforeP)),
	remove$.pipe(map(removeP))
).pipe(
	scan((acc, f) => f(acc), {} as Record<string, CmdListener[1][]>),
	shareReplay(1)
)

const commandRunner$ = (ctx: InitCommandsP) =>
	commandQueue$.pipe(
		combineLatestWith(commandStorage$),
		map(([commands, allListeners]) => {
			commands.forEach(command => {
				const { name, payload } = command as PayloadCmd

				const listeners = allListeners[name]

				if (listeners) {
					dequeue$.next({ name, payload })

					ctx.logger.debug(
						`Command ${name} invoked for ${listeners.length} listeners, payload: `,
						payload
					)

					listeners.forEach(listener => {
						listener({ ...ctx, payload })
					})
				} else {
					ctx.logger.notice(`Command "${name}" is not registerred`)
				}
			})
		})
	)
