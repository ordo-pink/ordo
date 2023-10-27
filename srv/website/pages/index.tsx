// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { CenteredPage } from "../components/centered-page"
import IndexHeroSection from "../components/index-hero"
import { PageHeader } from "../components/page-header"

export default function Home() {
	return (
		<main className="scroll-smooth">
			<IndexHeroSection />

			<section
				id="about"
				className="shadow-2xl shadow-purple-950 dark:shadow-purple-200 from-neutral-200 dark:from-neutral-900 to-neutral-200 dark:to-stone-900"
			>
				<CenteredPage centerX>
					<div className="w-full p-16 bg-gradient-to-b">
						<PageHeader text="Hi, I'm ORDO" />
					</div>
				</CenteredPage>
			</section>
		</main>
	)
}
