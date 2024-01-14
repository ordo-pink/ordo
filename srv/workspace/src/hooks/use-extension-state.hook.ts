import { BehaviorSubject } from "rxjs"
import { useStrictSubscription } from "./use-subscription"
import { useEffect } from "react"
import { Commands, EXTENSION_FILE_PREFIX, useSharedContext } from "@ordo-pink/frontend-core"
import { useContent } from "./use-content.hook"
import { Either } from "@ordo-pink/either"
import { noop } from "@ordo-pink/tau"

export const useExtensionState = <T extends Record<string, unknown>>(name: string) => {
	const { commands, data } = useSharedContext()
	const state = useStrictSubscription(state$, {} as Record<string, T>)

	const item =
		data?.find(item => item.name === `${EXTENSION_FILE_PREFIX}${name}` && item.parent === null) ??
		null

	useEffect(() => {
		Either.fromNullable(data)
			.chain(d => Either.fromBoolean(() => d.length > 0))
			.chain(() => Either.fromBoolean(() => !item))
			.fold(noop, () => {
				commands.emit<cmd.data.create>("data.create", {
					name: `${EXTENSION_FILE_PREFIX}${name}`,
					parent: null,
				})
			})
	}, [data, item, name])

	const content = useContent(item?.fsid)

	useEffect(() => {
		Either.fromNullable(content)
			.chain(str => Either.try(() => JSON.parse(str)))
			.fold(noop, content => {
				const currentState = state$.value
				const updatedState = { ...currentState, [name]: content }
				state$.next(updatedState)
			})
	}, [content, name])

	useEffect(() => {
		const updateHandler: Commands.Handler<any> = ({ payload: { name, payload } }) => {
			if (!item) return

			const currentState = state$.value
			const updatedState = { ...currentState, [name]: payload }
			state$.next(updatedState)

			commands.emit<cmd.data.setContent>("data.set-content", {
				fsid: item.fsid,
				content: JSON.stringify(payload),
				contentType: "application/json",
			})
		}

		commands.on<cmd.extensionState.update>("extension-state.update", updateHandler)

		return () => {
			commands.off<cmd.extensionState.update>("extension-state.update", updateHandler)
		}
	}, [item])

	return (state[name] as T) ?? {}
}

const state$ = new BehaviorSubject<Record<string, Record<string, any>>>({})
