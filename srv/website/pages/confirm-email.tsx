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

import { Centered } from "../components/centered"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import isEmail from "validator/lib/isEmail"
import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"
import Head from "next/head"
import Link from "next/link"
import { OrdoRoutes } from "@ordo-pink/ordo-routes"

const websiteHost = process.env.NEXT_PUBLIC_ORDO_ID_HOST!

export default function ConfirmEmailPage() {
	const { query } = useRouter()
	const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null)

	useEffect(() => {
		Oath.fromNullable(query)
			.chain(query =>
				Oath.fromNullable(query.email)
					.chain(Oath.ifElse(email => typeof email === "string", { onTrue: x => x as string }))
					.chain(Oath.ifElse(isEmail, {}))
					.chain(() => Oath.fromNullable(query.code))
					.map(() => query as { code: string; email: string }),
			)
			.chain(query =>
				Oath.from(() =>
					fetch(`${websiteHost}/confirm-email`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(query),
					}).then(res => res.json()),
				),
			)
			.fork(
				() => setIsEmailVerified(false),
				res => setIsEmailVerified(res.success),
			)
	}, [query])

	return Switch.of(isEmailVerified)
		.case(true, () => (
			<Centered centerX centerY screenHeight>
				<Head>
					<title>Ordo.pink | Почта подтверждена</title>
				</Head>
				<div className="flex flex-col space-y-2">
					<h1 className="mb-12 text-3xl font-black">Поздравляем!</h1>
					<p>
						Ваша почта подтверждена. Добро пожаловать в <Link href="/">Ordo.pink</Link>!
					</p>
					<p>Теперь вы будете среди первых, кто узнает о запуске.</p>
					<p>
						Можете закрыть эту страницу или отправиться <Link href="/">на главную</Link>. Приятного
						дня!
					</p>
				</div>
			</Centered>
		))
		.case(false, () => (
			<Centered centerX centerY screenHeight>
				<Head>
					<title>Ordo.pink | Почта не подтверждена</title>
				</Head>

				<div className="flex flex-col space-y-2">
					<h1 className="mb-12 text-3xl font-black">Что-то пошло не так.</h1>
					<p>Вы уверены, что перешли по ссылке, которую мы отправили на вашу почту?</p>
					<p>
						Если ссылка действительно не сработала, сообщите, пожалуйста, в{" "}
						<a href={telegramSupportURL}>техподдержку в Telegram</a> или напишите нам на почту{" "}
						<a href="mailto:support@ordo.pink?subject=Ошибка+подтверждения+электронной+почты">
							support@ordo.pink
						</a>
						.
					</p>
					<p>
						Если же вы просто прогуливаетесь по страницам &ndash; приходите к нам{" "}
						<Link href="/">на главную</Link>. Приятного дня!
					</p>
				</div>
			</Centered>
		))
		.default(() => (
			<Centered centerX centerY screenHeight>
				<Head>
					<title>Ordo.pink | Подтверждение электронной почты</title>
				</Head>
				<h1 className="mb-12 text-3xl font-black">Подтверждаем вашу почту...</h1>
				<p>Это вам не раз-два, знаете ли! ☝️</p>
			</Centered>
		))
}

// --- Internal ---

const telegramSupportURL = OrdoRoutes.External.TelegramSupportCIS.prepareRequest({ host: "" }).url
