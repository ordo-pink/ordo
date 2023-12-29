// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoRoutes } from "@ordo-pink/ordo-routes"
import { BsGithub, BsTelegram } from "react-icons/bs"
import { RiTwitterXLine } from "react-icons/ri"

export default function Footer() {
	const currentYear = new Date(Date.now()).getFullYear()

	return (
		<footer className="bg-neutral-900 shadow-xl rounded-lg text-neutral-200 w-full">
			<div className="w-full mx-auto container md:p-6 p-4 flex flex-col md:flex-row gap-6 items-center md:justify-between">
				<span className="text-sm text-neutral-200 sm:text-center dark:text-neutral-200">
					© {currentYear} Ordo.pink
				</span>
				<ul className="flex items-center gap-6 mt-3 text-2xl text-neutral-200 dark:text-neutral-200 sm:mt-0">
					<li>
						<a href={sourceCodeURL} target="_blank" rel="noreferrer noopener">
							<BsGithub className="text-2xl text-neutral-200 hover:text-pink-500 transition-colors duration-300" />
						</a>
					</li>

					<li>
						<a href={telegramSupportURL} target="_blank" rel="noreferrer noopener">
							<BsTelegram className="text-2xl text-neutral-200 hover:text-pink-500 transition-colors duration-300" />
						</a>
					</li>

					<li>
						<a
							href={twitterURL}
							target="_blank"
							rel="noreferrer noopener"
							className="text-2xl text-neutral-200 hover:text-pink-500 transition-colors duration-300"
						>
							<RiTwitterXLine />
						</a>
					</li>
				</ul>
				<ul className="flex flex-wrap mt-3 text-sm text-neutral-200 sm:mt-0">
					<li>
						<a
							href={privacyPolicyURL}
							rel="noreferrer noopener"
							className="mr-4 hover:underline md:mr-6 text-neutral-300"
						>
							Политика конфиденциальности
						</a>
					</li>
					<li>
						<a
							href={licenseURL}
							rel="noreferrer noopener"
							className="mr-4 hover:underline md:mr-6 text-neutral-300"
						>
							Лицензия
						</a>
					</li>
					<li>
						<a
							href="mailto:hello@ordo.pink"
							rel="noreferrer noopener"
							className="hover:underline text-neutral-300"
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
