// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { AuthResponse } from "@ordo-pink/backend-id-server"
import type { User } from "@ordo-pink/backend-user-service"
import type { Directory, File } from "@ordo-pink/backend-data-service"
import { AiOutlineLogout } from "react-icons/ai"
import { BehaviorSubject } from "rxjs"
import { callOnce, Unary, Nullable } from "@ordo-pink/tau"
import { cmd } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"
import { Logger } from "@ordo-pink/logger"
import { Oath } from "@ordo-pink/oath"
import { useSubscription } from "$hooks/use-subscription"
import { getCommands } from "$streams/commands"

const commands = getCommands()

const refreshToken = () =>
	fetch(`${process.env.REACT_APP_ID_HOST}/refresh-token`, {
		method: "POST",
		credentials: "include",
	})
		.then(res => res.json())
		.then(res => {
			if (res.success) return auth$.next(res.result)

			window.location.href = `${process.env.REACT_APP_WEB_HOST}/sign-out`
		})

type InitAuthP = { logger: Logger }
type InitAuth = Unary<InitAuthP, void>

export const __initAuth: InitAuth = callOnce(({ logger }) => {
	logger.debug("Initializing auth")

	refreshToken()

	const interval = setInterval(refreshToken, 50000)
	window.addEventListener("beforeunload", () => clearInterval(interval))

	commands.on("core.refresh-user-info", () =>
		Oath.fromNullable(auth$.value)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${process.env.REACT_APP_ID_HOST}/account`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}),
				),
			)
			.chain(res => Oath.from(() => res.json()))
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error)))
			.fork(
				(error: any) => error$.next(error),
				result => user$.next(result),
			),
	)

	commands.on("core.refresh-metadata-root", () =>
		Oath.fromNullable(auth$.value)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${process.env.REACT_APP_DATA_HOST}/directories/${auth.sub}`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}),
				),
			)
			.chain(res => Oath.from(() => res.json()))
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error)))
			.fork(
				error => error$.next(error),
				result => metadata$.next(result),
			),
	)

	commands.on("core.sign-out", () =>
		commands.emit<cmd.router.openExternal>("router.open-external", {
			url: `${process.env.REACT_APP_WEB_HOST}/sign-out`,
			newTab: false,
		}),
	)

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "core.sign-out",
		readableName: "Sign out",
		Icon: AiOutlineLogout,
		onSelect: () => commands.emit("core.sign-out"),
	})
})

const auth$ = new BehaviorSubject<Nullable<AuthResponse>>(null)
const metadata$ = new BehaviorSubject<(Directory | File)[]>([])
const user$ = new BehaviorSubject<Nullable<User>>(null)
const error$ = new BehaviorSubject<Nullable<string>>(null)

export const useAuthStatus = () => {
	const auth = useSubscription(auth$)
	return auth != null
}

export const useMetadata = () => {
	const metadata = useSubscription(metadata$)
	return Either.fromNullable(metadata)
}

export const useUser = () => {
	const user = useSubscription(user$)
	return Either.fromNullable(user)
}

export const useError = () => useSubscription(error$)
