/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Subject, combineLatestWith, map, merge, scan, shareReplay } from "rxjs"
import { equals } from "ramda"

import { R } from "@ordo-pink/result"
import { RRR } from "@ordo-pink/core"
import { call_once } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

type TCommand = (Ordo.Command.Command | Ordo.Command.PayloadCommand) & { fid: symbol }
type TCmdHandlerState = Record<string, Ordo.Command.TCommandHandler<any>[]>
type TCmdListener<N extends Ordo.Command.Name = Ordo.Command.Name, P = any> = [N, Ordo.Command.TCommandHandler<P>, symbol]

type TF = () => { get_commands: (fid: symbol) => Ordo.CreateFunction.GetCommandsFn }
export const init_commands: TF = call_once(() => {
	const logger = ordo_app_state.zags.select("logger")
	const is_dev = ordo_app_state.zags.select("constants.is_dev")
	const known_functions = ordo_app_state.zags.select("known_functions")

	const get_commands =
		(fid: symbol): Ordo.CreateFunction.GetCommandsFn =>
		() =>
			R.If(known_functions.has_permissions(fid, { queries: ["application.commands"] }))
				.pipe(R.ops.err_map(() => eperm("get_commands -> fid", fid)))
				.pipe(
					R.ops.map(() => {
						const func = known_functions.exchange(fid).cata({ Some: x => x, None: () => "unauthorized" })

						return {
							on: (name, handler) => {
								logger.debug(`🟣 Function "${func}" appended handler for command "${name}"`)
								add_after$.next([name, handler, fid])
							},
							off: (name, handler) => {
								logger.debug(`⚫ Function "${func}" removed handler for command "${name}"`)
								remove$.next([name, handler, fid])
							},
							emit: (name, payload?, key = crypto.randomUUID()) => {
								enqueue$.next({ name, payload, key, fid })
							},
							cancel: (name, payload?, key = crypto.randomUUID()) => {
								logger.debug(`⚫ Function "${func}" cancelled command "${name}"`)
								dequeue$.next({ name, payload, key, fid })
							},
						}
					}),
				)

	command_queue$
		.pipe(
			combineLatestWith(command_storage$),
			map(async ([commands, all_listeners]) => {
				for (const command of commands) {
					const name = command.name
					const fid = command.fid
					const func = known_functions.exchange(fid).cata({ Some: x => x, None: () => "unauthorized" })

					if (!known_functions.has_permissions(fid, { commands: [name] })) {
						logger.alert(`🔴 Function "${func}" did not request permission to execute command "${name}".`)

						return
					}

					const payload = is_payload_command(command) ? (command.payload as unknown) : undefined

					const listeners = all_listeners[name]

					if (listeners) {
						dequeue$.next({ name, payload, fid })

						if (payload !== undefined) {
							logger.debug(
								`🔵 Command "${name}" invoked by "${func}" for ${listeners.length} ${listeners.length === 1 ? "listener" : "listeners"}. Provided payload: `,
								payload,
							)
						} else {
							logger.debug(
								`🔵 Command "${name}" invoked by "${func}" for ${listeners.length} ${listeners.length === 1 ? "listener" : "listeners"}.`,
							)
						}

						for (const listener of listeners) {
							await listener(payload)
						}
					} else {
						is_dev &&
							logger.debug(
								`🟡 No handler found for the command "${name}". The command will stay pending until handler is registerred.`,
							)
					}
				}
			}),
		)
		.subscribe()

	logger.debug("🟢 Initialised commands.")

	return { get_commands }
})

const is_payload_command = (cmd: Ordo.Command.Command): cmd is Ordo.Command.PayloadCommand =>
	typeof cmd.name === "string" && (cmd as Ordo.Command.PayloadCommand).payload !== undefined

type TEnqueue = (cmd: TCommand) => (state: TCommand[]) => TCommand[]
const enqueue: TEnqueue = new_command => state =>
	state.some(cmd => cmd.key === new_command.key) ? state : [...state, new_command]

type TDequeue = (cmd: TCommand) => (state: TCommand[]) => TCommand[]
const dequeue: TDequeue = command => state => {
	if (state.some(cmd => cmd.key === command.key)) return state.filter(cmd => cmd.key === command.key)

	const target_has_payload = is_payload_command(command)

	return state.filter(cmd => {
		const current_has_payload = is_payload_command(cmd)

		const both_have_no_payload = !target_has_payload && !current_has_payload
		const both_have_payload = target_has_payload && current_has_payload

		const names_match = command.name === cmd.name

		return !(names_match && (both_have_no_payload || (both_have_payload && equals(command.payload, cmd.payload))))
	})
}

type TAdd = (listener: TCmdListener) => (state: Record<string, TCmdListener[1][]>) => TCmdHandlerState
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

type TRemove = (listener: TCmdListener) => (state: Record<string, TCmdListener[1][]>) => TCmdHandlerState
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
	scan((acc, f) => f(acc), [] as ((Ordo.Command.Command | Ordo.Command.PayloadCommand) & { fid: symbol })[]),
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

const eperm = RRR.codes.eperm("init_hosts")
