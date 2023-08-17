// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Head } from "#x/fresh@1.2.0/runtime.ts"
import { CenteredPage } from "../components/centered-page.tsx"
import { PageHeader } from "../components/page-header.tsx"
import IndexHeroSection from "../islands/pages/index-hero.tsx"

// TODO: Compress images
export default function Home() {
	return (
		<>
			<Head>
				<title>Ordo.pink</title>
				<link rel="stylesheet" href="/index.css" />
			</Head>

			<IndexHeroSection />

			<section class="shadow-2xl shadow-black dark:shadow-white">
				<CenteredPage centerX>
					<div class="p-16">
						<PageHeader>Hi, I'm ORDO</PageHeader>
					</div>
				</CenteredPage>
			</section>
		</>
	)
}
