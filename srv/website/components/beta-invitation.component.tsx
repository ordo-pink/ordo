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

import { OrdoRoutes } from "@ordo-pink/ordo-routes"
import { Button } from "./button"

type P = { wide?: boolean }
export default function BetaInvitation({ wide }: P) {
	return (
		<div className="w-full max-w-2xl space-y-8 rounded-lg bg-gradient-to-br from-sky-200/80 via-indigo-200/80 to-indigo-200/80 px-8 py-4 shadow-lg md:py-12 dark:from-sky-950 dark:via-indigo-950 dark:to-indigo-950">
			<div
				className={
					wide
						? "flex w-full flex-col justify-between space-y-8 md:flex-row"
						: "flex flex-col space-y-8"
				}
			>
				<div>
					<h3 className="text-2xl font-bold">
						<span className="text-purple-600 dark:text-orange-400">pub</span>{" "}
						<span className="text-purple-600 dark:text-orange-400">fn</span>{" "}
						<span className="text-neutral-700 dark:text-white">teβt</span>
						<span className="text-orange-600 dark:text-purple-400">()</span>{" "}
						<span className="text-purple-600 dark:text-orange-400">&rarr;</span>
					</h3>
					<p className="center ml-4 opacity-75">
						Бета-тестирование <strong>ORDO</strong> началось!
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
						<Button
							onClick={async e => {
								e.preventDefault()

								window.location.href = signUpURL
							}}
						>
							Присоединиться
						</Button>

						<Button
							inverted
							onClick={async e => {
								e.preventDefault()

								window.location.href = signInURL
							}}
						>
							Войти
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

// --- Internal ---

const signInURL = OrdoRoutes.Website.SignIn.prepareRequest({ host: "" }).url
const signUpURL = OrdoRoutes.Website.SignUp.prepareRequest({ host: "" }).url
