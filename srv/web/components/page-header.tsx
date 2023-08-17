// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Head } from "$fresh/runtime.ts"
import { RenderableProps } from "preact"

type Props = {}

export const PageHeader = ({ children }: RenderableProps<Props>) => (
	<h1 class="text-4xl font-black first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent">
		<Head>
			<title>Ordo.pink | {children}</title>
		</Head>

		{children}
	</h1>
)
