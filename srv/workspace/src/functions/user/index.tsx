// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Button } from "$components/button"
import Card from "$components/card.component"
import { EmailInput, PasswordInput, TextInput } from "$components/input"
import Null from "$components/null"
import { Title } from "$components/page-header"
import UsedSpace from "$components/used-space"
import { useSubscription } from "$hooks/use-subscription"
import { __Auth$, useUser } from "$streams/auth"
import { Hosts } from "$utils/hosts"
import { UserUtils } from "$utils/user-utils.util"
import { Extensions, ComponentSpace, Functions, User } from "@ordo-pink/frontend-core"
import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"
import { Nullable, noop } from "@ordo-pink/tau"
import { useEffect, useState } from "react"
import { AiOutlineLogout } from "react-icons/ai"
import { BsPersonBadge } from "react-icons/bs"

type UserComponentParams = Extensions.ComponentProps & { auth$: Nullable<__Auth$> }
const UserActivity = ({ space, auth$, commands }: UserComponentParams) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <Icon />)
		.case(ComponentSpace.WIDGET, () => <Null />)
		.default(() => <UserPage auth$={auth$} commands={commands} />)

const Icon = () => <BsPersonBadge />

type Params = Functions.CreateFunctionParams & { auth$: Nullable<__Auth$> }
export default function createUserFunction({ commands, auth$ }: Params) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: props => <UserActivity auth$={auth$} {...props} />,
		name: "user",
		routes: ["/user"],
		background: true,
	})

	commands.on<cmd.user.goToAccount>("user.go-to-account", () =>
		commands.emit<cmd.router.navigate>("router.navigate", "/user"),
	)

	commands.on<cmd.user.signOut>("user.sign-out", () =>
		commands.emit<cmd.router.openExternal>("router.open-external", {
			url: `${Hosts.WEBSITE}/sign-out`,
			newTab: false,
		}),
	)

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "user.go-to-user",
		readableName: "Аккаунт",
		Icon,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.user.goToAccount>("user.go-to-account")
		},
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "core.sign-out",
		readableName: "Выйти",
		Icon: AiOutlineLogout,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.user.signOut>("user.sign-out")
		},
	})
}

type _P = { auth$: Nullable<__Auth$> } & Pick<Extensions.ComponentProps, "commands">
const UserPage = ({ auth$, commands }: _P) => {
	const userE = useUser()

	useEffect(() => {
		commands.emit<cmd.sidebar.disable>("sidebar.disable")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return userE.fold(Null, user => <UserInfo auth$={auth$} user={user} commands={commands} />)
}

type _UIP = _P & { user: User.User }
const UserInfo = ({ user, auth$, commands }: _UIP) => {
	const auth = useSubscription(auth$)

	const [email, setEmail] = useState(user.email)
	// const [handle, setHandle] = useState(user.handle ?? "")
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [repeatNewPassword, setRepeatNewPassword] = useState("")
	const [firstName, setFirstName] = useState(user.firstName ?? "")
	const [lastName, setLastName] = useState(user.lastName ?? "")
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])

	return (
		<form
			onSubmit={e => e.preventDefault()}
			className="px-2 py-4 md:px-8 md:py-8 flex flex-col items-center space-y-4 overflow-x-auto"
		>
			<div className="w-full max-w-lg flex space-x-4 mb-8 md:mb-4 items-center">
				<div className="flex items-center justify-center rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer">
					<img
						src={`${Hosts.STATIC}/logo.png`}
						alt="avatar"
						className="h-16 md:h-20 rounded-full bg-white dark:from-stone-900 dark:via-zinc-900 dark:to-neutral-900"
						// onClick={() =>
						// 	showModal(() => <UploadAvatarModal onAvatarChanged={handleAvatarChanged} />)
						// }
					/>
				</div>
				<div className="w-full max-w-md flex flex-col space-y-1 md:space-y-2">
					<Title level="2" trim styledFirstLetter>
						{UserUtils.getUserName(user)}
					</Title>
					<UsedSpace />
				</div>
			</div>

			<div className="container grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
				<Card title="Идентификация">
					<fieldset className="w-full h-full justify-center flex flex-col space-y-4">
						<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-2">
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

							<Button
								disabled={emailErrors.length > 0 || email === user.email}
								onClick={() =>
									Oath.try(() =>
										fetch(`${Hosts.ID}/change-email`, {
											method: "PATCH",
											headers: {
												authorization: `Bearer ${auth!.accessToken}`,
												"content-type": "application/json",
											},
											body: JSON.stringify({ email }),
										}).then(res => res.json()),
									)
										.rejectedMap(() => "Connection error")
										.chain(res =>
											Oath.fromBoolean(
												() => res.success,
												noop,
												() => res.error,
											),
										)
										.fork(
											err => setEmailErrors([err ? err : "Invalid email"]),
											() => commands.emit<cmd.user.refreshInfo>("user.refresh"),
										)
								}
							>
								Изменить
							</Button>
						</div>

						{/* <div>
							<EmailConfirmation confirmed={user.emailConfirmed} />
						</div> */}
					</fieldset>
				</Card>

				<Card title="Личная информация">
					<fieldset className="w-full h-full justify-center flex flex-col space-y-4">
						<TextInput
							placeholder="E.g. Neil"
							value={firstName}
							id="firstName"
							autocomplete="given-name"
							label="Имя"
							onInput={e => setFirstName(e.target.value)}
						/>
						<TextInput
							placeholder="E.g. Armstrong"
							value={lastName}
							id="lastName"
							autocomplete="family-name"
							label="Фамилия"
							onInput={e => setLastName(e.target.value)}
						/>

						<Button
							disabled={
								firstName === user.firstName && lastName === user.lastName
								// && handle === user.handle
							}
							onClick={() =>
								Oath.try(() =>
									fetch(`${Hosts.ID}/change-account-info`, {
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
									)
									.fork(
										err => setEmailErrors([err ? err : "Invalid email"]),
										() => commands.emit<cmd.user.refreshInfo>("user.refresh"),
									)
							}
						>
							Изменить
						</Button>
					</fieldset>
				</Card>

				<Card title="Пароль">
					<fieldset className="w-full h-full justify-center flex flex-col space-y-4">
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

						<Button
							disabled={
								passwordErrors.length > 0 ||
								!oldPassword ||
								!newPassword ||
								!repeatNewPassword ||
								newPassword !== repeatNewPassword
							}
							onClick={() =>
								Oath.try(() =>
									fetch(`${Hosts.ID}/change-password`, {
										method: "PATCH",
										credentials: "include",
										headers: {
											authorization: `Bearer ${auth!.accessToken}`,
											"content-type": "application/json",
										},
										body: JSON.stringify({ oldPassword, newPassword, repeatNewPassword }),
									}).then(res => res.json()),
								)
									.chain(res => Oath.fromBoolean(() => res.success, noop))
									.fork(
										err => setEmailErrors([err ? err.message : "Invalid email"]),
										() => {
											setOldPassword("")
											setNewPassword("")
											setRepeatNewPassword("")
											commands.emit<cmd.user.refreshInfo>("user.refresh")
										},
									)
							}
						>
							Изменить
						</Button>
					</fieldset>
				</Card>

				<Card title="Подписка">
					<p className="text-center text-sm text-neutral-500">
						Подключение платной подписки станет доступно совсем скоро™️!
					</p>
				</Card>

				{/* <Card title="Active sessions">
					<p className="text-center text-sm text-neutral-500">
						We'll put active sessions info here in the next update. Stay active!
					</p>
				</Card> */}

				<Card title="Достижения" className="md:col-span-2">
					<p className="text-center text-sm text-neutral-500">Тут ачивочки TODO</p>
				</Card>
			</div>
		</form>
	)
}

// type _ECP = { confirmed: boolean }
// const EmailConfirmation = ({ confirmed }: _ECP) =>
// 	Either.fromBoolean(() => confirmed, EmailConfirmed).getOrElse(EmailNotConfirmed)

// const EmailNotConfirmed = () => (
// 	<div className="flex items-center justify-center space-x-2">
// 		<BsPatchExclamation className="text-rose-500" />
// 		<div>
// 			Email not confirmed. <button className="text-sky-500">Confirm</button>.
// 		</div>
// 	</div>
// )

// const EmailConfirmed = () => (
// 	<div className="flex items-center justify-center space-x-2">
// 		<BsPatchCheckFill className="text-emerald-500" />
// 		<div>Email confirmed.</div>
// 	</div>
// )
