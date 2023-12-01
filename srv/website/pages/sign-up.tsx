// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Head from "next/head"
import { Centered } from "../components/centered"
import { PageHeader } from "../components/page-header"
import SignUpForm from "../components/sign-up-form"

export default function SignUpPage() {
	return (
		<Centered centerX centerY screenHeight>
			<Head>
				<title>Ordo.pink | Регистрация</title>
			</Head>

			<div className="w-full max-w-sm">
				<section className="w-full px-4 mx-auto text-center">
					<PageHeader text="Регистрация" />
				</section>

				<section className="w-full px-4 py-8 mx-auto">
					<SignUpForm
						workspaceHost={process.env.NEXT_PUBLIC_WORKSPACE_HOST!}
						idHost={process.env.NEXT_PUBLIC_ID_HOST!}
					/>
				</section>
			</div>
		</Centered>
	)
}
