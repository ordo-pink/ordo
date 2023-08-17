// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { PageHeader } from "../components/page-header.tsx"
import { CenteredPage } from "../components/centered-page.tsx"
import SignUpForm from "../islands/forms/sign-up-form.tsx"

export default function SignUpPage() {
	return (
		<CenteredPage centerX centerY>
			<div class="w-full max-w-sm">
				<section class="w-full px-4 mx-auto text-center">
					<PageHeader>Sign up</PageHeader>
				</section>

				<section class="w-full px-4 py-8 mx-auto">
					<SignUpForm />
				</section>
			</div>
		</CenteredPage>
	)
}
