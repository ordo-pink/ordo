// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Head from "next/head"
import { PageHeader } from "../components/page-header"
import { Centered } from "../components/centered"
import SignInForm from "../components/sign-in-form"

export default function SignInPage() {
	return (
		<Centered centerX centerY>
			<Head>
				<title>Ordo.pink | Sign in</title>
			</Head>

			<div className="w-full max-w-sm">
				<section className="w-full px-4 mx-auto text-center">
					<PageHeader text="Sign in" />
				</section>

				<section className="w-full px-4 py-8 mx-auto">
					<SignInForm
						workspaceHost={process.env.NEXT_PUBLIC_WORKSPACE_HOST!}
						idHost={process.env.NEXT_PUBLIC_ID_HOST!}
					/>
				</section>
			</div>
		</Centered>
	)
}
