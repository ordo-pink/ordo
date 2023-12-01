// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Head from "next/head"
import { Centered } from "../components/centered"
import { PageHeader } from "../components/page-header"

export default function ForgotPasswordPage() {
	return (
		<Centered centerX centerY screenHeight>
			<Head>
				<title>Ordo.pink | Восстановление пароля</title>
			</Head>

			<PageHeader text="Это пока не работает" />
			<p>
				Но потом заработает, конечно. А пока, можно написать{" "}
				<a rel="noreferrer noopener" href="https://t.me/ordo_pink">
					нам в поддержку в Telegram
				</a>
				, поможем в ручном порядке.
			</p>
		</Centered>
	)
}
