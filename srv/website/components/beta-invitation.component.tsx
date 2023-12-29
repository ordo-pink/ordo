// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoRoutes } from "@ordo-pink/ordo-routes"
import { Button } from "./button"

type P = { wide?: boolean }
export default function BetaInvitation({ wide }: P) {
	return (
		<div className="w-full space-y-8 px-8 py-4 md:py-12 bg-gradient-to-br max-w-2xl from-sky-200/80 dark:from-sky-950 via-indigo-200/80 dark:via-indigo-950 to-indigo-200/80 dark:to-indigo-950 rounded-lg shadow-lg">
			<div
				className={
					wide
						? "flex flex-col space-y-8 w-full justify-between md:flex-row"
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
					<p className="center opacity-75 ml-4">
						Бета-тестирование <strong>ORDO</strong> началось!
					</p>
				</div>

				<div className="flex flex-col space-y-4">
					<div
						className={
							wide
								? "flex flex-col space-y-2 mt-2"
								: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between items-center"
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
