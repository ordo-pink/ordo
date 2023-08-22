// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Head from "next/head"
import { CenteredPage } from "../components/centered-page"
import { PageHeader } from "../components/page-header"
import SignUpForm from "../components/sign-up-form"

export default function SignUpPage() {
	return (
		<CenteredPage centerX centerY>
			<Head>
				<title>Ordo.pink | Sign up</title>
			</Head>

			<div className="w-full max-w-sm">
				<section className="w-full px-4 mx-auto text-center">
					<PageHeader text="Sign up" />
				</section>

				<section className="w-full px-4 py-8 mx-auto">
					<SignUpForm />
				</section>
			</div>
		</CenteredPage>
	)
}
