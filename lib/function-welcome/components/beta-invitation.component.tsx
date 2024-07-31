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

import Button from "@ordo-pink/frontend-react-components/button"
import { use$ } from "@ordo-pink/frontend-react-hooks"

type P = { wide?: boolean }
export default function BetaInvitation({ wide }: P) {
	const commands = use$.commands()
	const translate_auth = use$.scoped_translation("pink.ordo.auth")
	const translate_welcome = use$.scoped_translation("pink.ordo.welcome")

	const t_sign_up = translate_auth("sign_up_title")
	const t_sign_in = translate_auth("sign_in_title")
	const t_beta_started = translate_welcome("beta_started_announcement")

	return (
		<div className="w-full max-w-2xl space-y-8 rounded-lg bg-gradient-to-br from-sky-200/80 via-indigo-200/80 to-indigo-200/80 px-8 py-4 shadow-lg md:py-12 dark:from-sky-950 dark:via-indigo-950 dark:to-indigo-950">
			<div
				className={
					wide ? "flex w-full items-center justify-between md:flex-row" : "flex flex-col space-y-8"
				}
			>
				<div>
					<h3 className="text-2xl font-bold">
						<span className="text-purple-600 dark:text-orange-400">const</span>{" "}
						<span className="text-neutral-700 dark:text-white">teβt</span>{" "}
						<span className="text-purple-600 dark:text-orange-400">=</span>{" "}
						<span className="text-orange-600 dark:text-purple-400">()</span>{" "}
						<span className="align-middle text-purple-600 dark:text-orange-400">⇒</span>
					</h3>
					<p className="center ml-4 opacity-75">
						<strong>ORDO</strong> {t_beta_started}
					</p>
				</div>

				<div className="flex flex-col space-y-4">
					<div
						className={
							wide
								? "mt-2 flex flex-col space-y-2"
								: "flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0"
						}
					>
						<Button.Primary
							onClick={e => {
								e.preventDefault()

								commands.emit("cmd.auth.open_sign_up")
							}}
						>
							{t_sign_up}
						</Button.Primary>

						<Button.Secondary
							onClick={e => {
								e.preventDefault()

								commands.emit("cmd.auth.open_sign_in")
							}}
						>
							{t_sign_in}
						</Button.Secondary>
					</div>
				</div>
			</div>
		</div>
	)
}
