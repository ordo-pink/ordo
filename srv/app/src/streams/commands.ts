// deno-lint-ignore-file no-explicit-any
import type { Logger } from "#lib/logger/mod"

import { equals } from "ramda"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"
import { Binary, callOnce, Unary } from "#lib/tau/mod"

type InitCommandsParams = {
	logger: Logger
}

export type Command<Name extends `${string}.${string}` = `${string}.${string}`> = {
	name: Name
}

export type PayloadCommand<
	Name extends `${string}.${string}` = `${string}.${string}`,
	Payload = unknown
> = Command<Name> & {
	payload: Payload
}

export type CommandContext<Payload = any> = {
	logger: Logger
	payload: Payload
}

export type CommandHandler<Payload> = Unary<CommandContext<Payload>, void | Promise<void>>

export type CommandListener<
	Name extends `${string}.${string}` = `${string}.${string}`,
	Payload = any
> = [Name, CommandHandler<Payload>]

export type RegisterredCommand<
	Payload = any,
	Name extends `${string}.${string}` = `${string}.${string}`
> = [Name, CommandHandler<Payload>]

export type RegisterCommandFn<
	Payload = any,
	Name extends `${string}.${string}` = `${string}.${string}`
> = Binary<Name, CommandHandler<Payload>, RegisterredCommand<Payload, Name>>

export type ExecuteCommandFn<
	Name extends `${string}.${string}` = `${string}.${string}`,
	Payload = any
> = (type: Name, payload?: Payload) => void

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
	typeof cmd.name === "string" && (cmd as PayloadCommand).payload !== undefined

const addToQueue$ = new Subject<Command | PayloadCommand>()
const removeFromQueue$ = new Subject<Command | PayloadCommand>()

const addToStorage$ = new Subject<CommandListener>()
const addToStorageBefore$ = new Subject<CommandListener>()
const addToStorageAfter$ = new Subject<CommandListener>()
const removeFromStorage$ = new Subject<CommandListener>()

const addToQueue =
	(newCommand: Command | PayloadCommand) => (state: (Command | PayloadCommand)[]) =>
		[...state, newCommand]

const removeFromQueue =
	(command: Command | PayloadCommand) => (state: (Command | PayloadCommand)[]) => {
		const targetHasPayload = isPayloadCommand(command)

		return state.filter(cmd => {
			const currentHasPayload = isPayloadCommand(cmd)

			const bothHaveNoPayload = !targetHasPayload && !currentHasPayload
			const bothHavePayload = targetHasPayload && currentHasPayload

			const typesMatch = command.name === cmd.name

			return !(
				typesMatch &&
				(bothHaveNoPayload || (bothHavePayload && equals(command.payload, cmd.payload)))
			)
		})
	}

const addToStorageBefore =
	(newListener: CommandListener) => (state: Record<string, CommandListener[1][]>) => {
		const listeners = state[newListener[0]]

		if (!listeners) {
			state[newListener[0]] = [newListener[1]]
		} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
			state[newListener[0]].unshift(newListener[1])
		}

		return state
	}

const addToStorageAfter =
	(newListener: CommandListener) => (state: Record<string, CommandListener[1][]>) => {
		const listeners = state[newListener[0]]

		if (!listeners) {
			state[newListener[0]] = [newListener[1]]
		} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
			state[newListener[0]].push(newListener[1])
		}

		return state
	}

const addToStorage =
	(newListener: CommandListener) => (state: Record<string, CommandListener[1][]>) => {
		const listeners = state[newListener[0]]

		if (!listeners) {
			state[newListener[0]] = [newListener[1]]
		} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
			state[newListener[0]].push(newListener[1])
		}

		return state
	}

const removeFromStorage =
	(listener: CommandListener) => (state: Record<string, CommandListener[1][]>) => {
		if (!state[listener[0]]) return state

		state[listener[0]] = state[listener[0]].filter(f => f.toString() !== listener[1].toString())

		return state
	}

const commandQueue$ = merge(
	addToQueue$.pipe(map(addToQueue)),
	removeFromQueue$.pipe(map(removeFromQueue))
).pipe(
	scan((acc, f) => f(acc), [] as (Command | PayloadCommand)[]),
	shareReplay(1)
)

const commandStorage$ = merge(
	addToStorage$.pipe(map(addToStorage)),
	addToStorageBefore$.pipe(map(addToStorageBefore)),
	addToStorageAfter$.pipe(map(addToStorageAfter)),
	removeFromStorage$.pipe(map(removeFromStorage))
).pipe(
	scan((acc, f) => f(acc), {} as Record<string, CommandListener[1][]>),
	shareReplay(1)
)

const commandRunner$ = (ctx: InitCommandsParams) =>
	commandQueue$.pipe(
		combineLatestWith(commandStorage$),
		map(([commands, allListeners]) => {
			commands.forEach(command => {
				const { name, payload } = command as PayloadCommand

				const listeners = allListeners[name]

				if (listeners) {
					removeFromQueue$.next({ name, payload })

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

export const initCommands = callOnce((ctx: InitCommandsParams) => {
	commandRunner$(ctx).subscribe()
})

export const executeCommand: ExecuteCommandFn = <
	Name extends `${string}.${string}` = `${string}.${string}`,
	Payload = any
>(
	name: Name,
	payload?: Payload
) => {
	addToQueue$.next({ name, payload })
}

export const registerCommand: RegisterCommandFn = (name, listener) => {
	const command = [name, listener] as CommandListener

	addToStorage$.next(command)

	return command
}

export const prependListener: RegisterCommandFn = (name, listener) => {
	const command = [name, listener] as CommandListener

	addToStorageBefore$.next(command)

	return command
}

export const appendListener: RegisterCommandFn = (name, handler) => {
	const command = [name, handler] as CommandListener

	addToStorageAfter$.next(command)

	return command
}

export const unregisterCommand: RegisterCommandFn = (name, handler) => {
	const command = [name, handler] as CommandListener

	removeFromStorage$.next(command as any)

	return command
}
