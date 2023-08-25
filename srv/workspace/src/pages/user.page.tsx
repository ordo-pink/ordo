// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Button } from "$components/button"
import Card from "$components/card.component"
import { EmailInput, PasswordInput, TextInput } from "$components/input"
import Null from "$components/null"
import { Title } from "$components/page-header"
import UsedSpace from "$components/used-space"
import { useUser } from "$streams/auth"
import { getCommands } from "$streams/commands"
import { AuthResponse } from "@ordo-pink/backend-id-server"
import { User } from "@ordo-pink/backend-user-service"
import { Either } from "@ordo-pink/either"
import { cmd } from "@ordo-pink/frontend-core"
import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"
import { Nullable, noop } from "@ordo-pink/tau"
import { useState } from "react"
import { BsPatchCheckFill, BsPatchExclamation } from "react-icons/bs"

const commands = getCommands()

type _P = { auth: Nullable<AuthResponse> }
export default function UserPage({ auth }: _P) {
	const userE = useUser()

	return Either.fromNullable(auth)
		.chain(() => userE)
		.fold(Null, user => <UserInfo auth={auth} user={user} />)
}

// TODO: Collect errors
// TODO: Hide email confirmation status (until the endpoint is available)
// TODO: Add endpoint for changing personal info
// TODO: Add uploading avatar

type _UIP = _P & { user: User }
const UserInfo = ({ user, auth }: _UIP) => {
	const [email, setEmail] = useState(user.email)
	const [username, setUsername] = useState(user.username)
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [repeatNewPassword, setRepeatNewPassword] = useState("")
	const [firstName, setFirstName] = useState(user.firstName)
	const [lastName, setLastName] = useState(user.lastName)
	const [emailErrors, setEmailErrors] = useState<string[]>([])
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])

	return (
		<div className="px-2 py-4 md:px-8 md:py-8 flex flex-col items-center space-y-4 overflow-x-auto">
			<div className="max-w-lg flex space-x-4 mb-8 md:mb-4 items-center">
				<div className="flex items-center justify-center rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer">
					<img
						src={`${process.env.REACT_APP_STATIC_HOST}/logo.png`}
						alt="avatar"
						className="h-16 md:h-20 rounded-full bg-white dark:from-stone-900 dark:via-zinc-900 dark:to-neutral-900"
						// onClick={() =>
						// 	showModal(() => <UploadAvatarModal onAvatarChanged={handleAvatarChanged} />)
						// }
					/>
				</div>
				<div className="flex flex-col space-y-1 md:space-y-2">
					<Title level="2" trim>
						{Switch.of(user)
							.case(
								u => !!u.firstName && !!u.lastName && !!u.username,
								() => `${user.firstName} ${user.lastName} (${user.username})`,
							)
							.case(
								u => !!u.firstName && !!u.lastName,
								() => `${user.firstName![0]}. ${user.lastName}`,
							)
							.case(
								u => !!u.firstName,
								() => user.firstName,
							)
							.case(
								u => !!u.username,
								() => user.username,
							)
							.default(() => user.email)}
					</Title>
					<UsedSpace />
				</div>
			</div>

			<div className="container grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
				<Card title="Email">
					<fieldset className="w-full h-full justify-center flex flex-col space-y-4">
						<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-2">
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
										fetch(`${process.env.REACT_APP_ID_HOST}/change-email`, {
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
								Change
							</Button>
						</div>

						<div>
							<EmailConfirmation confirmed={user.emailConfirmed} />
						</div>
					</fieldset>
				</Card>

				<Card title="Personal info">
					<fieldset className="w-full h-full justify-center flex flex-col space-y-4">
						<TextInput
							label="Username"
							type="text"
							placeholder="E.g. moonmarine"
							id="username"
							value={username}
							onInput={e => setUsername(e.target.value)}
						/>

						<TextInput
							placeholder="E.g. Neil"
							value={firstName}
							id="firstName"
							label="First name"
							onInput={e => setFirstName(e.target.value)}
						/>
						<TextInput
							placeholder="E.g. Armstrong"
							value={lastName}
							id="lastName"
							label="Last name"
							onInput={e => setLastName(e.target.value)}
						/>

						<Button
							disabled={
								firstName === user.firstName &&
								lastName === user.lastName &&
								username === user.username
							}
						>
							Change
						</Button>
					</fieldset>
				</Card>

				<Card title="Password">
					<fieldset className="w-full h-full justify-center flex flex-col space-y-4">
						<PasswordInput
							label="Old password"
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
							label="New password"
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
							label="Repeat new password"
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
									fetch(`${process.env.REACT_APP_ID_HOST}/change-password`, {
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
							Change
						</Button>
					</fieldset>
				</Card>

				<Card title="Subscription" className="md:col-span-2">
					<p className="text-center text-sm text-neutral-500">
						We'll soon add paid plans for more space and integrations. Stay rich!
					</p>
				</Card>

				<Card title="Active sessions">
					<p className="text-center text-sm text-neutral-500">
						We'll put active sessions info here in the next update. Stay active!
					</p>
				</Card>

				<Card title="Achievements" className="md:col-span-3">
					<p className="text-center text-sm text-neutral-500">
						You'll find your achievements here soon. Stay tuned!
					</p>
				</Card>
			</div>
		</div>
	)
}

type _ECP = { confirmed: boolean }
const EmailConfirmation = ({ confirmed }: _ECP) =>
	Either.fromBoolean(() => confirmed, EmailConfirmed).getOrElse(EmailNotConfirmed)

const EmailNotConfirmed = () => (
	<div className="flex items-center justify-center space-x-2">
		<BsPatchExclamation className="text-rose-500" />
		<div>
			Email not confirmed. <button className="text-sky-500">Confirm</button>.
		</div>
	</div>
)

const EmailConfirmed = () => (
	<div className="flex items-center justify-center space-x-2">
		<BsPatchCheckFill className="text-emerald-500" />
		<div>Email confirmed.</div>
	</div>
)
