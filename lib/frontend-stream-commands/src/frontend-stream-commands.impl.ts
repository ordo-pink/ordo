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

import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Result } from "@ordo-pink/result"
import { type TGetCommandsFn } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

// --- Internal ---

const forbidden_commands = () => ({
	on: () => {
		throw "Invalid FID. Registerring commands is disallowed."
	},
	off: () => {
		throw "Invalid FID. Unregisterring commands is disallowed."
	},
	after: () => {
		throw "Invalid FID. Registerring commands is disallowed."
	},
	before: () => {
		throw "Invalid FID. Registerring commands is disallowed."
	},
	emit: () => {
		throw "Invalid FID. Emitting commands is disallowed."
	},
	cancel: () => {
		throw "Invalid FID. Cancelling commands is disallowed."
	},
})

const commands = (fid: symbol): Client.Commands.Commands => ({
	on: (name, handler) => add_after$.next([name, handler, fid]),
	off: (name, handler) => remove$.next([name, handler, fid]),
	after: (name, handler) => add_after$.next([name, handler, fid]),
	before: (name, handler) => add_before$.next([name, handler, fid]),
	emit: (name, payload?, key = crypto.randomUUID()) => enqueue$.next({ name, payload, key, fid }),
	cancel: (name, payload?, key = crypto.randomUUID()) => dequeue$.next({ name, payload, key, fid }),
})

type TCommand = (Client.Commands.Command | Client.Commands.PayloadCommand) & { fid: symbol }
type TCmdHandlerState = Record<string, Client.Commands.Handler<any>[]>
type TCmdListener<N extends Client.Commands.CommandName = Client.Commands.CommandName, P = any> = [
	N,
	Client.Commands.Handler<P>,
	symbol,
]

// TODO: Only put debug info in dev mode
type TInitCommandsFn = (params: { logger: TLogger; log_commands_without_handlers?: boolean }) => {
	get_commands: TGetCommandsFn
}
export const init_commands: TInitCommandsFn = call_once(
	({ logger, log_commands_without_handlers = true }) => {
		logger.debug("Initializing commands...")

		command_queue$
			.pipe(
				combineLatestWith(command_storage$),
				map(async ([commands, all_listeners]) => {
					for (const command of commands) {
						const name = command.name
						const fid = command.fid
						const func = KnownFunctions.exchange(fid) ?? "unauthorized"

						if (!KnownFunctions.check_permissions(fid, { commands: [name] })) {
							logger.alert(
								`Function "${func}" did not request permission to execute command "${name}".`,
							)

							return
						}

						const payload = is_payload_command_guard(command)
							? (command.payload as unknown)
							: undefined

						const listeners = all_listeners[name]

						if (listeners) {
							dequeue$.next({ name, payload, fid })

							if (payload !== undefined) {
								logger.debug(
									`Command "${name}" invoked by "${func}" for ${listeners.length} ${listeners.length === 1 ? "listener" : "listeners"}. Provided payload: `,
									payload,
								)
							} else {
								logger.debug(
									`Command "${name}" invoked by "${func}" for ${listeners.length} ${listeners.length === 1 ? "listener" : "listeners"}.`,
								)
							}

							for (const listener of listeners) {
								await listener(payload)
							}
						} else {
							log_commands_without_handlers &&
								logger.debug(
									`No handler found for the command "${name}". The command will stay pending until handler is registerred.`,
								)
						}
					}
				}),
			)
			.subscribe()

		logger.debug("Initialised commands.")

		return {
			get_commands: fid => () =>
				Result.FromNullable(fid)
					.pipe(Result.ops.chain(fid => Result.If(KnownFunctions.validate(fid))))
					.pipe(Result.ops.map(() => fid as symbol))
					.cata({ Ok: commands, Err: forbidden_commands }),
		}
	},
)

const is_payload_command_guard = (
	cmd: Client.Commands.Command,
): cmd is Client.Commands.PayloadCommand =>
	typeof cmd.name === "string" && (cmd as Client.Commands.PayloadCommand).payload !== undefined

type TEnqueue = (cmd: TCommand) => (state: TCommand[]) => TCommand[]
const enqueue: TEnqueue = new_command => state =>
	state.some(cmd => cmd.key === new_command.key) ? state : [...state, new_command]

type TDequeue = (cmd: TCommand) => (state: TCommand[]) => TCommand[]
const dequeue: TDequeue = command => state => {
	if (state.some(cmd => cmd.key === command.key))
		return state.filter(cmd => cmd.key === command.key)

	const target_has_payload = is_payload_command_guard(command)

	return state.filter(cmd => {
		const current_has_payload = is_payload_command_guard(cmd)

		const both_have_no_payload = !target_has_payload && !current_has_payload
		const both_have_payload = target_has_payload && current_has_payload

		const names_match = command.name === cmd.name

		return !(
			names_match &&
			(both_have_no_payload || (both_have_payload && equals(command.payload, cmd.payload)))
		)
	})
}

type TAdd = (
	listener: TCmdListener,
) => (state: Record<string, TCmdListener[1][]>) => TCmdHandlerState
const add_before: TAdd = new_listener => state => {
	const listeners = state[new_listener[0]]

	if (!listeners) {
		state[new_listener[0]] = [new_listener[1]]
	} else if (!listeners.some(listener => listener.toString() === new_listener[1].toString())) {
		state[new_listener[0]].unshift(new_listener[1])
	}

	return state
}

const add_after: TAdd = new_listener => state => {
	const listeners = state[new_listener[0]]

	if (!listeners) {
		state[new_listener[0]] = [new_listener[1]]
	} else if (!listeners.some(listener => listener.toString() === new_listener[1].toString())) {
		state[new_listener[0]].push(new_listener[1])
	}

	return state
}

type TRemove = (
	listener: TCmdListener,
) => (state: Record<string, TCmdListener[1][]>) => TCmdHandlerState
const remove: TRemove = listener => state => {
	if (!state[listener[0]]) return state

	state[listener[0]] = state[listener[0]].filter(f => f.toString() !== listener[1].toString())

	return state
}

const enqueue$ = new Subject<TCommand>()
const dequeue$ = new Subject<TCommand>()
const add_after$ = new Subject<TCmdListener>()
const add_before$ = new Subject<TCmdListener>()
const remove$ = new Subject<TCmdListener>()
const command_queue$ = merge(enqueue$.pipe(map(enqueue)), dequeue$.pipe(map(dequeue))).pipe(
	scan(
		(acc, f) => f(acc),
		[] as ((Client.Commands.Command | Client.Commands.PayloadCommand) & { fid: symbol })[],
	),
	shareReplay(1),
)

const command_storage$ = merge(
	add_after$.pipe(map(add_after)),
	add_before$.pipe(map(add_before)),
	remove$.pipe(map(remove)),
).pipe(
	scan((acc, f) => f(acc), {} as Record<string, TCmdListener[1][]>),
	shareReplay(1),
)
