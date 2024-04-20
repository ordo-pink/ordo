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

import { BsGithub, BsTelegram } from "react-icons/bs"
import { RiTwitterXLine } from "react-icons/ri"

import { OrdoRoutes } from "@ordo-pink/ordo-routes"

export default function Footer() {
	const currentYear = new Date(Date.now()).getFullYear()

	return (
		<footer className="w-full rounded-lg bg-neutral-900 text-neutral-200 shadow-xl">
			<div className="container mx-auto flex w-full flex-col items-center gap-6 p-4 md:flex-row md:justify-between md:p-6">
				<span className="text-sm text-neutral-200 sm:text-center dark:text-neutral-200">
					© {currentYear} Ordo.pink
				</span>
				<ul className="mt-3 flex items-center gap-6 text-2xl text-neutral-200 sm:mt-0 dark:text-neutral-200">
					<li>
						<a href={sourceCodeURL} target="_blank" rel="noreferrer noopener">
							<BsGithub className="text-2xl text-neutral-200 transition-colors duration-300 hover:text-pink-500" />
						</a>
					</li>

					<li>
						<a href={telegramSupportURL} target="_blank" rel="noreferrer noopener">
							<BsTelegram className="text-2xl text-neutral-200 transition-colors duration-300 hover:text-pink-500" />
						</a>
					</li>

					<li>
						<a
							href={twitterURL}
							target="_blank"
							rel="noreferrer noopener"
							className="text-2xl text-neutral-200 transition-colors duration-300 hover:text-pink-500"
						>
							<RiTwitterXLine />
						</a>
					</li>
				</ul>
				<ul className="mt-3 flex flex-wrap text-sm text-neutral-200 sm:mt-0">
					<li>
						<a
							href={privacyPolicyURL}
							rel="noreferrer noopener"
							className="mr-4 text-neutral-300 hover:underline md:mr-6"
						>
							Политика конфиденциальности
						</a>
					</li>
					<li>
						<a
							href={licenseURL}
							rel="noreferrer noopener"
							className="mr-4 text-neutral-300 hover:underline md:mr-6"
						>
							Лицензия
						</a>
					</li>
					<li>
						<a
							href="mailto:hello@ordo.pink"
							rel="noreferrer noopener"
							className="text-neutral-300 hover:underline"
						>
							Написать нам
						</a>
					</li>
				</ul>
			</div>
		</footer>
	)
}

// --- Internal ---

const privacyPolicyURL = OrdoRoutes.Website.PrivacyPolicy.prepareRequest({ host: "" }).url
const telegramSupportURL = OrdoRoutes.External.TelegramSupportCIS.prepareRequest({ host: "" }).url
const twitterURL = OrdoRoutes.External.TwitterX.prepareRequest({ host: "" }).url
const sourceCodeURL = OrdoRoutes.External.SourceCode.prepareRequest({ host: "" }).url
const licenseURL = OrdoRoutes.External.License.prepareRequest({ host: "" }).url
