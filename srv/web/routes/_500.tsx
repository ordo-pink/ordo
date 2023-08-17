// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ErrorPageProps } from "$fresh/server.ts"
import { Callout } from "../components/callout.tsx"
import { CenteredPage } from "../components/centered-page.tsx"

export default function Error500Page({ error }: ErrorPageProps) {
	return (
		<CenteredPage
			centerX
			centerY
		>
			<h1 class="text-5xl md:text-9xl text-center mb-8">BOOM!</h1>
			<Callout type="error">{(error as Error).message}</Callout>
		</CenteredPage>
	)
}
