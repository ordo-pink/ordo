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

// import { BsPatchCheckFill, BsPatchExclamation } from "react-icons/bs"
import { useEffect, useState } from "react"

import { EmailInput, PasswordInput, TextInput } from "@ordo-pink/frontend-react-components/input"
import { N, noop } from "@ordo-pink/tau"
import {
	useCommands,
	useHostsUnsafe,
	useSubscription,
	useUser,
	useUserEmail,
	useUserName,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { Oath } from "@ordo-pink/oath"
import { auth$ } from "@ordo-pink/frontend-stream-user"
import { useFetch } from "@ordo-pink/frontend-fetch"

import Button from "@ordo-pink/frontend-react-components/button"
import Card from "@ordo-pink/frontend-react-components/card"
import Heading from "@ordo-pink/frontend-react-components/heading"
import UsedSpace from "@ordo-pink/frontend-react-components/used-space"

export default function UserWorkspace() {
	const user = useUser()
	const commands = useCommands()
	const userName = useUserName()
	const userEmail = useUserEmail()
	const fetch = useFetch()
	const { static_host: staticHost, id_host: idHost } = useHostsUnsafe()

	const auth = useSubscription(auth$)

	const [email, setEmail] = useState(user?.email ?? "")
	// const [handle, setHandle] = useState(user.handle ?? "")
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [repeatNewPassword, setRepeatNewPassword] = useState("")
	const [firstName, setFirstName] = useState(user?.firstName ?? "")
	const [lastName, setLastName] = useState(user?.lastName ?? "")
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set-title", "Аккаунт")

		Either.fromNullable(user).fold(N, user => {
			setEmail(user.email)
			setFirstName(user.firstName ?? "")
			setLastName(user.lastName ?? "")
		})
	}, [user, commands])

	return (
		<form
			onSubmit={e => e.preventDefault()}
			className="flex flex-col items-center space-y-4 px-2 py-4"
		>
			<div className="flex size-full flex-col items-center justify-center">
				<div className="flex w-full max-w-lg flex-col items-center space-y-4">
					<div className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
						<img
							src={`${staticHost}/logo.png`}
							alt="avatar"
							// onClick={() =>
							// 	showModal(() => <UploadAvatarModal onAvatarChanged={handleAvatarChanged} />)
							// }
							className="h-16 rounded-full bg-white md:h-20 dark:from-stone-900 dark:via-zinc-900 dark:to-neutral-900"
						/>
					</div>
					<div className="flex w-full max-w-md flex-col space-y-1 md:space-y-2">
						<Heading level="2" trim styledFirstLetter>
							{userName?.fullName || userEmail}
						</Heading>
						<UsedSpace />
					</div>
				</div>
			</div>

			<div className="container grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
				<Card title="Идентификация">
					<fieldset className="flex size-full flex-col justify-center space-y-4">
						<div className="flex flex-col space-y-4 md:flex-row md:space-x-2 md:space-y-0">
							{/* <TextInput
							label="Public handle"
							type="text"
							placeholder="E.g. moonmarine"
							id="publicHandle"
							autocomplete="handle"
							value={handle}
							onInput={e => setHandle(e.target.value)}
						/> */}

							<EmailInput
								value={email}
								onInput={e => setEmail(e.target.value)}
								onChange={emailE =>
									emailE.fold(setEmailErrors, email => {
										setEmail(email)
										setEmailErrors([])
									})
								}
							/>

							<Button.Primary
								disabled={emailErrors.length > 0 || email === user?.email}
								onClick={() =>
									void Oath.fromNullable(auth)
										.tap(() =>
											commands.emit<cmd.application.background_task.start_saving>(
												"application.background_task.start_saving",
											),
										)
										.chain(({ accessToken }) =>
											Oath.from(() =>
												fetch(`${idHost}/change-email`, {
													method: "PATCH",
													headers: {
														authorization: `Bearer ${accessToken}`,
														"content-type": "application/json",
													},
													body: JSON.stringify({ email }),
												}),
											),
										)
										.chain(res => Oath.from(() => res.json()))
										.rejectedMap(() => "Connection error")
										.chain(Oath.ifElse(res => res.success, { onFalse: res => res.error }))
										.tap(() =>
											commands.emit<cmd.application.background_task.reset_status>(
												"application.background_task.reset_status",
											),
										)
										.fork(
											err => setEmailErrors([err ? err : "Invalid email"]),
											() => commands.emit<cmd.user.refresh_info>("user.refresh"),
										)
								}
							>
								Изменить
							</Button.Primary>
						</div>

						{/* <div>
							<EmailConfirmation confirmed={!!user?.emailConfirmed} />
						</div> */}
					</fieldset>
				</Card>

				<Card title="Личная информация">
					<fieldset className="flex size-full flex-col justify-center space-y-4">
						<TextInput
							placeholder="Юрий"
							value={firstName}
							id="firstName"
							autocomplete="given-name"
							label="Имя"
							onInput={e => setFirstName(e.target.value)}
						/>
						<TextInput
							placeholder="Гагарин"
							value={lastName}
							id="lastName"
							autocomplete="family-name"
							label="Фамилия"
							onInput={e => setLastName(e.target.value)}
						/>

						<Button.Primary
							disabled={
								firstName === userName?.firstName && lastName === userName?.lastName
								// && handle === user.handle
							}
							onClick={() =>
								void Oath.empty()
									.tap(() =>
										commands.emit<cmd.application.background_task.start_saving>(
											"application.background_task.start_saving",
										),
									)
									.chain(() =>
										Oath.try(() =>
											fetch(`${idHost}/change-account-info`, {
												method: "PATCH",
												headers: {
													authorization: `Bearer ${auth!.accessToken}`,
													"content-type": "application/json",
												},
												body: JSON.stringify({ firstName, lastName }),
											}).then(res => res.json()),
										)
											.rejectedMap(() => "Connection error")
											.chain(res =>
												Oath.fromBoolean(
													() => res.success,
													noop,
													() => res.error,
												),
											),
									)
									.tap(() =>
										commands.emit<cmd.application.background_task.reset_status>(
											"application.background_task.reset_status",
										),
									)
									.fork(
										err => setEmailErrors([err ? err : "Invalid email"]),
										() => commands.emit<cmd.user.refresh_info>("user.refresh"),
									)
							}
						>
							Изменить
						</Button.Primary>
					</fieldset>
				</Card>

				<Card title="Пароль">
					<fieldset className="flex size-full flex-col justify-center space-y-4">
						<PasswordInput
							label="Текущий пароль"
							id="currentPassword"
							autocomplete="current-password"
							value={oldPassword}
							onInput={e => setOldPassword(e.target.value)}
							onChange={response =>
								response.fold(setPasswordErrors, pwd => {
									setOldPassword(pwd)
									setPasswordErrors([])
								})
							}
						/>

						<PasswordInput
							label="Новый пароль"
							id="newPassword"
							autocomplete="new-password"
							value={newPassword}
							onInput={e => setNewPassword(e.target.value)}
							onChange={response =>
								response.fold(setPasswordErrors, pwd => {
									setNewPassword(pwd)
									setPasswordErrors([])
								})
							}
						/>

						<PasswordInput
							label="Новый пароль ещё разок"
							id="repeatPassword"
							autocomplete="new-password"
							value={repeatNewPassword}
							onInput={e => setRepeatNewPassword(e.target.value)}
							onChange={response =>
								response.fold(setPasswordErrors, pwd => {
									setRepeatNewPassword(pwd)
									setPasswordErrors([])
								})
							}
						/>

						<Button.Primary
							disabled={
								passwordErrors.length > 0 ||
								!oldPassword ||
								!newPassword ||
								!repeatNewPassword ||
								newPassword !== repeatNewPassword
							}
							onClick={() =>
								void Oath.empty()
									.tap(() =>
										commands.emit<cmd.application.background_task.start_saving>(
											"application.background_task.start_saving",
										),
									)
									.chain(() =>
										Oath.try(() =>
											fetch(`${idHost}/change-password`, {
												method: "PATCH",
												credentials: "include",
												headers: {
													authorization: `Bearer ${auth!.accessToken}`,
													"content-type": "application/json",
												},
												body: JSON.stringify({ oldPassword, newPassword, repeatNewPassword }),
											}).then(res => res.json()),
										).chain(res => Oath.fromBoolean(() => res.success, noop)),
									)
									.tap(() =>
										commands.emit<cmd.application.background_task.reset_status>(
											"application.background_task.reset_status",
										),
									)
									.fork(
										err => setEmailErrors([err ? err.message : "Invalid email"]),
										() => {
											setOldPassword("")
											setNewPassword("")
											setRepeatNewPassword("")
											commands.emit<cmd.user.refresh_info>("user.refresh")
										},
									)
							}
						>
							Изменить
						</Button.Primary>
					</fieldset>
				</Card>

				<div></div>

				<Card title="Подписка">
					<p className="text-center text-sm text-neutral-500">
						Подключение платной подписки станет доступно совсем скоро™️!
					</p>
				</Card>

				{/* <Card title="Active sessions">
					<p className="text-sm text-center text-neutral-500">
						We'll put active sessions info here in the next update. Stay active!
					</p>
				</Card> */}
			</div>
		</form>
	)
}

// --- Internal ---

// type _ECP = { confirmed: boolean }
// const EmailConfirmation = ({ confirmed }: _ECP) =>
// 	Either.fromBoolean(() => confirmed, EmailConfirmed).getOrElse(EmailNotConfirmed)

// const EmailNotConfirmed = () => (
// 	<div className="flex justify-center items-center space-x-2">
// 		<BsPatchExclamation className="text-rose-500" />
// 		<div>
// 			Email not confirmed. <button className="text-sky-500">Confirm</button>.
// 		</div>
// 	</div>
// )

// const EmailConfirmed = () => (
// 	<div className="flex justify-center items-center space-x-2">
// 		<BsPatchCheckFill className="text-emerald-500" />
// 		<div>Email confirmed.</div>
// 	</div>
// )
