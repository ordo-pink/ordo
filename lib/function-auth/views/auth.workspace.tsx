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

import { useEffect } from "react"

import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"
import { use$ } from "@ordo-pink/frontend-react-hooks"

import Loading from "@ordo-pink/frontend-react-components/loading-page"

import SignIn from "../components/sign-in.component"
import SignUp from "../components/sign-up.component"

export default function Auth() {
	const commands = use$.commands()

	const { action } = use$.route_params<{ action: TAction }>()

	useEffect(() => {
		void Oath.FromNullable(action)
			.pipe(
				Oath.ops.chain(action =>
					Oath.If(SUPPORTED_ACTIONS.includes(action), {
						F: () => commands.emit("cmd.auth.open_sign_in"),
					}),
				),
			)
			.invoke(Oath.invokers.or_nothing)
	}, [action, commands])

	const Component = Switch.Match(action)
		.case("sign-in", () => SignIn)
		.case("sign-up", () => SignUp)
		.case("confirm-email", () => Loading) // TODO: Confirm email
		.case("forgot-password", () => Loading) // TODO: Forgot password
		.default(() => Loading)

	return (
		<div className="flex h-dvh flex-col items-center justify-center">
			<Component />
		</div>
	)
}

// --- Internal ---

const SUPPORTED_ACTIONS = [
	"sign-up",
	"sign-in",
	"sign-out",
	"confirm-email",
	"forgot-password",
] as const

type TAction = (typeof SUPPORTED_ACTIONS)[number]
