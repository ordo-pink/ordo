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

import { use$ } from "@ordo-pink/frontend-react-hooks"

import Link from "@ordo-pink/frontend-react-components/link"

export default function Footer() {
	const translate_common = use$.scoped_translation("common")

	const t_twitter_url = translate_common("twitter_url")
	const t_telegram_support_url = translate_common("telegram_support_url")
	const t_license = translate_common("license")
	const t_contact_us = translate_common("contact_us")

	const currentYear = new Date(Date.now()).getFullYear()

	return (
		<footer className="w-full rounded-lg bg-neutral-900 text-neutral-200 shadow-xl">
			<div className="container mx-auto flex w-full flex-col items-center gap-6 p-4 md:flex-row md:justify-between md:p-6">
				<span className="text-sm text-neutral-200 sm:text-center dark:text-neutral-200">
					© {currentYear}{" "}
					<Link href="/" className="!text-current no-underline">
						Ordo.pink
					</Link>
				</span>
				<ul className="mt-3 flex items-center gap-6 text-2xl text-neutral-200 sm:mt-0 dark:text-neutral-200">
					<li>
						<Link
							href="https://github.com/ordo-pink/ordo"
							external
							new_tab
							rel="noreferrer noopener"
						>
							<BsGithub className="text-2xl text-neutral-200 transition-colors duration-300 hover:text-pink-500" />
						</Link>
					</li>

					<li>
						<Link href={t_telegram_support_url} external new_tab rel="noreferrer noopener">
							<BsTelegram className="text-2xl text-neutral-200 transition-colors duration-300 hover:text-pink-500" />
						</Link>
					</li>

					<li>
						<Link
							href={t_twitter_url}
							external
							new_tab
							rel="noreferrer noopener"
							className="text-2xl text-neutral-200 transition-colors duration-300 hover:text-pink-500"
						>
							<RiTwitterXLine />
						</Link>
					</li>
				</ul>
				<ul className="mt-3 flex flex-wrap gap-x-2 text-sm text-neutral-200 sm:mt-0">
					{/* <li>
						<Link
							href={privacyPolicyURL}
							rel="noreferrer noopener"
							className="mr-4 text-neutral-300 hover:underline md:mr-6"
						>
							{t_privacy_policy}
						</Link>
					</li> */}
					<li>
						<Link
							href="https://github.com/ordo-pink/ordo/blob/main/license.md"
							className="mr-4 text-neutral-300 hover:underline md:mr-6"
							rel="noreferrer noopener"
							new_tab
							external
						>
							{t_license}
						</Link>
					</li>
					<li>
						<Link
							href="mailto:hello@ordo.pink"
							external
							new_tab
							rel="noreferrer noopener"
							className="text-neutral-300 hover:underline"
						>
							{t_contact_us}
						</Link>
					</li>
				</ul>
			</div>
		</footer>
	)
}
