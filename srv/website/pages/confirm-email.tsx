// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Centered } from "../components/centered"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import isEmail from "validator/lib/isEmail"
import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"

const websiteHost = process.env.NEXT_PUBLIC_ID_HOST!

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
				<div className="flex flex-col space-y-2">
					<h1 className="text-3xl font-black mb-12">Поздравляем!</h1>
					<p>
						Ваша почта подтверждена. Добро пожаловать в <a href="https://ordo.pink">Ordo.pink</a>!
					</p>
					<p>Теперь вы будете среди первых, кто узнает о запуске.</p>
					<p>
						Можете закрыть эту страницу или отправиться <a href="https://ordo.pink">на главную</a>.
						Приятного дня!
					</p>
				</div>
			</Centered>
		))
		.case(false, () => (
			<Centered centerX centerY screenHeight>
				<div className="flex flex-col space-y-2">
					<h1 className="text-3xl font-black mb-12">Что-то пошло не так.</h1>
					<p>Вы уверены, что перешли по ссылке, которую мы отправили на вашу почту?</p>
					<p>
						Если ссылка действительно не сработала, сообщите, пожалуйста, в{" "}
						<a href="https://t.me/ordo_pink">техподдержку в Telegram</a> или напишите нам на почту{" "}
						<a href="mailto:support@ordo.pink?subject=Ошибка+подтверждения+электронной+почты">
							support@ordo.pink
						</a>
						.
					</p>
					<p>
						Если же вы просто прогуливаетесь по страницам &ndash; приходите к нам{" "}
						<a href="https://ordo.pink">на главную</a>. Приятного дня!
					</p>
				</div>
			</Centered>
		))
		.default(() => (
			<Centered centerX centerY screenHeight>
				<h1 className="text-3xl font-black mb-12">Подтверждаем вашу почту...</h1>
				<p>Это вам не раз-два, знаете ли! ☝️</p>
			</Centered>
		))
}
