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

import { call_once, deep_equals } from "@ordo-pink/tau"
import { ZAGS } from "@ordo-pink/zags"

import { ordo_app_state } from "../app.state"

type TCommand = (Ordo.Command.Command | Ordo.Command.PayloadCommand) & { fid: symbol }
type TCmdListener<N extends Ordo.Command.Name = Ordo.Command.Name, P = any> = [N, Ordo.Command.CommandHandler<P>, symbol]

type TF = () => { get_commands: (fid: symbol) => Ordo.Command.Commands }
export const init_commands: TF = call_once(() => {
	const logger = ordo_app_state.zags.select("logger")
	const is_dev = ordo_app_state.zags.select("constants.is_dev")
	const known_functions = ordo_app_state.zags.select("known_functions")

	const get_commands = (fid: symbol) => {
		const func = known_functions.exchange(fid).cata({ Some: x => x, None: () => "unauthorized" })

		return {
			on: (name, handler) => {
				logger.debug(`⚪️ '${func}' appended handler for command '${name}'`)
				add_before([name, handler, fid])
			},
			off: (name, handler) => {
				logger.debug(`⚫ '${func}' removed handler for command '${name}'`)
				remove([name, handler, fid])
			},
			emit: (name, payload?, key = crypto.randomUUID()) => {
				enqueue({ name, payload, key, fid })
			},
			cancel: (name, payload?, key = crypto.randomUUID()) => {
				logger.debug(`🟣 '${func}' cancelled command '${name}'`)
				dequeue({ name, payload, key, fid })
			},
		} satisfies Ordo.Command.Commands
	}

	command$.marry(({ queue, storage }) => {
		for (const command of queue) {
			const name = command.name
			const fid = command.fid
			const func = known_functions.exchange(fid).cata({ Some: x => x, None: () => "unauthorized" })

			const payload = is_payload_command(command) ? (command.payload as unknown) : undefined

			if (!known_functions.has_permissions(fid, { commands: [name] })) {
				logger.error(`${func} permission RRR. Did you forget to request command permission '${name}'?`)
				dequeue({ name, payload, fid })

				return
			}

			const listeners = storage[name]

			if (listeners) {
				dequeue({ name, payload, fid })

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

				for (const listener of listeners) listener(payload)
			} else {
				is_dev &&
					logger.debug(
						`🟡 No handler found for the command "${name}". The command will stay pending until handler is registerred.`,
					)
			}
		}
	})

	logger.debug("🟢 Initialised commands.")

	return { get_commands }
})

const is_payload_command = (cmd: Ordo.Command.Command): cmd is Ordo.Command.PayloadCommand =>
	typeof cmd.name === "string" && (cmd as Ordo.Command.PayloadCommand).payload !== undefined

const enqueue = (new_command: TCommand) =>
	command$.update("queue", state => (state.some(cmd => cmd.key === new_command.key) ? state : [...state, new_command]))

const dequeue = (command: TCommand) =>
	command$.update("queue", state => {
		if (state.some(cmd => cmd.key === command.key)) return state.filter(cmd => cmd.key === command.key)

		const target_has_payload = is_payload_command(command)

		return state.filter(cmd => {
			const current_has_payload = is_payload_command(cmd)

			const both_have_no_payload = !target_has_payload && !current_has_payload
			const both_have_payload = target_has_payload && current_has_payload

			const names_match = command.name === cmd.name

			return !(names_match && (both_have_no_payload || (both_have_payload && deep_equals(command.payload, cmd.payload))))
		})
	})

const add_before = (new_listener: TCmdListener) =>
	command$.update("storage", state => {
		const listeners = state[new_listener[0]]

		if (!listeners) {
			state[new_listener[0]] = [new_listener[1]]
		} else if (!listeners.some(listener => listener.toString() === new_listener[1].toString())) {
			state[new_listener[0]].unshift(new_listener[1])
		}

		return state
	})

// const add_after = (new_listener: TCmdListener) =>
// 	command$.update("storage", state => {
// 		const listeners = state[new_listener[0]]

// 		if (!listeners) {
// 			state[new_listener[0]] = [new_listener[1]]
// 		} else if (!listeners.some(listener => listener.toString() === new_listener[1].toString())) {
// 			state[new_listener[0]].push(new_listener[1])
// 		}

// 		return state
// 	})

const remove = (listener: TCmdListener) =>
	command$.update("storage", state => {
		if (!state[listener[0]]) return state

		state[listener[0]] = state[listener[0]].filter(f => f.toString() !== listener[1].toString())

		return state
	})

const command$ = ZAGS.Of({
	queue: [] as ((Ordo.Command.Command | Ordo.Command.PayloadCommand) & { fid: symbol })[],
	storage: {} as Record<string, Ordo.Command.CommandHandler<any>[]>,
})
