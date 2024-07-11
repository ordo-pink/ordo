// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { combineLatestWith } from "rxjs/internal/operators/combineLatestWith"
import { map } from "rxjs/internal/operators/map"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { Subject } from "rxjs/internal/Subject"
import { equals } from "ramda"
import { merge } from "rxjs/internal/observable/merge"

import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { type Logger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"
import { getLogger } from "@ordo-pink/frontend-logger"

/**
 * Entrypoint for using commands. You can use this function outside React components.
 */
export const getCommands = (fid: symbol | null): Client.Commands.Commands =>
	Either.fromNullable(fid)
		.chain(fid => Either.fromBoolean(validateFID(fid), () => fid))
		.leftMap(() => getLogger(fid))
		.fold(forbiddenCommands, commands)

// --- Internal ---

const validateFID = (fid: symbol) => (): boolean => KnownFunctions.validate(fid)

const forbiddenCommands = (logger: Logger) => ({
	on: () => logger.alert("Invalid FID. Registerring commands is disallowed."),
	off: () => logger.alert("Invalid FID. Unregisterring commands is disallowed."),
	after: () => logger.alert("Invalid FID. Registerring commands is disallowed."),
	before: () => logger.alert("Invalid FID. Registerring commands is disallowed."),
	emit: () => logger.alert("Invalid FID. Emitting commands is disallowed."),
	cancel: () => logger.alert("Invalid FID. Cancelling commands is disallowed."),
})

const commands = (fid: symbol): Client.Commands.Commands => ({
	on: (name, handler) => addAfter$.next([name, handler, fid]),
	off: (name, handler) => remove$.next([name, handler, fid]),
	after: (name, handler) => addAfter$.next([name, handler, fid]),
	before: (name, handler) => addBefore$.next([name, handler, fid]),
	emit: (name, payload?, key = crypto.randomUUID()) => enqueue$.next({ name, payload, key, fid }),
	cancel: (name, payload?, key = crypto.randomUUID()) => dequeue$.next({ name, payload, key, fid }),
})

type Command = (Client.Commands.Command | Client.Commands.PayloadCommand) & { fid: symbol }
type CmdHandlerState = Record<string, Client.Commands.Handler<any>[]>
type CmdListener<N extends Client.Commands.CommandName = Client.Commands.CommandName, P = any> = [
	N,
	Client.Commands.Handler<P>,
	symbol,
]

type InitCommandsParams = { fid: symbol; showCommandsWithoutHandlers?: boolean }
export const __initCommands = call_once(
	({ fid, showCommandsWithoutHandlers = true }: InitCommandsParams) => {
		const logger = getLogger(fid)

		logger.debug("Initializing commands...")

		commandQueue$
			.pipe(
				combineLatestWith(commandStorage$),
				map(async ([commands, allListeners]) => {
					for (const command of commands) {
						const name = command.name
						const fid = command.fid
						const logger = getLogger(fid)

						if (!KnownFunctions.checkPermissions(fid, { commands: [name] })) {
							const func = KnownFunctions.exchange(fid) ?? "unauthorized"
							logger.alert(
								`Function "${func}" did not request permission to execute command "${name}".`,
							)

							return
						}

						const payload = isPayloadCommand(command) ? (command.payload as unknown) : undefined

						const listeners = allListeners[name]

						if (listeners) {
							dequeue$.next({ name, payload, fid })

							logger.debug(
								`Command "${name}" invoked for ${listeners.length} ${listeners.length === 1 ? "listener" : "listeners"}. Provided payload: `,
								payload,
							)

							for (const listener of listeners) {
								await listener(payload)
							}
						} else {
							showCommandsWithoutHandlers &&
								logger.debug(
									`No handler found for the command "${name}". The command will stay pending until handler is registerred.`,
								)
						}
					}
				}),
			)
			.subscribe()

		logger.debug("Initialised commands.")
	},
)

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
