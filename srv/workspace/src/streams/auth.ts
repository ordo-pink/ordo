// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { AuthResponse } from "@ordo-pink/backend-id-server"
import type { User } from "@ordo-pink/backend-user-service"
import { AiOutlineLogout } from "react-icons/ai"
import { BehaviorSubject, Observable } from "rxjs"
import { callOnce, Unary, Nullable } from "@ordo-pink/tau"
import { cmd } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"
import { Logger } from "@ordo-pink/logger"
import { Oath } from "@ordo-pink/oath"
import { useSubscription } from "$hooks/use-subscription"
import { getCommands } from "$streams/commands"
import { rrrToNotification } from "$utils/error-to-notification"
import { Hosts } from "$utils/hosts"

const commands = getCommands()

const refreshToken = () =>
	fetch(`${Hosts.ID}/refresh-token`, {
		method: "POST",
		credentials: "include",
	})
		.then(res => res.json())
		.then(res => {
			if (res.success) return auth$.next(res.result)

			window.location.href = `${Hosts.WEBSITE}/sign-out`
		})

type InitAuthP = { logger: Logger }
type InitAuth = Unary<InitAuthP, __Auth$>

export type __Auth$ = Observable<Nullable<AuthResponse>>
export const __initAuth: InitAuth = callOnce(({ logger }) => {
	logger.debug("Initializing auth")

	refreshToken()

	const beforeUnloadListener = () => {
		clearInterval(interval)
		window.removeEventListener("beforeunload", beforeUnloadListener)
	}

	const interval = setInterval(refreshToken, 50000)
	window.addEventListener("beforeunload", beforeUnloadListener)

	commands.on<cmd.user.refreshInfo>("user.refresh", () =>
		Oath.fromNullable(auth$.value)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.ID}/account`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}),
				),
			)
			.chain(res => Oath.from(() => res.json()))
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.map(body => ({
				...body,
				createdAt: new Date(body.createdAt),
				updatedAt: new Date(body.updatedAt),
			}))
			.rejectedMap(rrrToNotification("Error fetching user info"))
			.fork(
				item => commands.emit<cmd.notification.show>("notification.show", item),
				result => user$.next(result),
			),
	)

	commands.on<cmd.user.signOut>("user.sign-out", () =>
		commands.emit<cmd.router.openExternal>("router.open-external", {
			url: `${Hosts.WEBSITE}/sign-out`,
			newTab: false,
		}),
	)

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "core.sign-out",
		readableName: "Sign out",
		Icon: AiOutlineLogout,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.user.signOut>("user.sign-out")
		},
	})

	return auth$
})

const auth$ = new BehaviorSubject<Nullable<AuthResponse>>(null)
const user$ = new BehaviorSubject<Nullable<User>>(null)

export const useAuthStatus = () => {
	const auth = useSubscription(auth$)
	return auth != null
}

export const useUser = () => {
	const user = useSubscription(user$)
	return Either.fromNullable(user)
}
