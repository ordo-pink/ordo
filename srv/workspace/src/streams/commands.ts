import type { Logger } from "#lib/logger/mod"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"
import { equals } from "ramda"
import { Binary, callOnce, Curry, Unary } from "#lib/tau/mod"

// --- Public ---

export type CmdName = `${string}.${string}`

export type Cmd<N extends CmdName = CmdName> = { name: N }
export type CmdCtx<P = any> = { logger: Logger; payload: P }
export type CmdHandler<P> = Unary<CmdCtx<P>, void | Promise<void>>
export type CmdListener<N extends CmdName = CmdName, P = any> = [N, CmdHandler<P>]
export type PayloadCmd<N extends CmdName = CmdName, P = any> = Cmd<N> & { payload: P }

export const getCommands = () => ({ on, off, emit, after, before })

// --- Internal ---

export const __initCommands = callOnce((ctx: InitCommandsP) => {
	commandRunner$(ctx).subscribe()
})

type InitCommandsP = { logger: Logger }
type OnFn<Payload = any, Name extends CmdName = CmdName> = Binary<Name, CmdHandler<Payload>, void>
type EmitFn<Name extends CmdName = CmdName, Payload = any> = (type: Name, payload?: Payload) => void
type Command = Cmd | PayloadCmd
type EnqueueP = Curry<Binary<Command, Command[], Command[]>>
type DequeueP = Curry<Binary<Command, Command[], Command[]>>
type CmdHandlerState = Record<string, CmdHandler<any>[]>
type AddP = Curry<Binary<CmdListener, Record<string, CmdListener[1][]>, CmdHandlerState>>
type RemoveP = Curry<Binary<CmdListener, Record<string, CmdListener[1][]>, CmdHandlerState>>

const isPayloadCmd = (cmd: Cmd): cmd is PayloadCmd =>
	typeof cmd.name === "string" && (cmd as PayloadCmd).payload !== undefined

const on: OnFn = (name, handler) => add$.next([name, handler])
const off: OnFn = (name, handler) => remove$.next([name, handler])
const emit: EmitFn = (name, payload) => enqueue$.next({ name, payload })
const after: OnFn = (name, handler) => addAfter$.next([name, handler])
const before: OnFn = (name, handler) => addBefore$.next([name, handler])

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

const addAfterP: AddP = newListener => state => {
	const listeners = state[newListener[0]]

	if (!listeners) {
		state[newListener[0]] = [newListener[1]]
	} else if (!listeners.some(listener => listener.toString() === newListener[1].toString())) {
		state[newListener[0]].push(newListener[1])
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
const addAfter$ = new Subject<CmdListener>()
const remove$ = new Subject<CmdListener>()
const commandQueue$ = merge(enqueue$.pipe(map(enqueueP)), dequeue$.pipe(map(dequeueP))).pipe(
	scan((acc, f) => f(acc), [] as (Cmd | PayloadCmd)[]),
	shareReplay(1)
)

const commandStorage$ = merge(
	add$.pipe(map(addP)),
	addBefore$.pipe(map(addBeforeP)),
	addAfter$.pipe(map(addAfterP)),
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
