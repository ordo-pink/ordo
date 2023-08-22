import { CenteredPage } from "../components/centered-page"
import IndexHeroSection from "../components/index-hero"
import { PageHeader } from "../components/page-header"

export default function Home() {
	return (
		<main className="scroll-smooth">
			<IndexHeroSection />

			<section id="about" className="shadow-2xl shadow-black dark:shadow-white">
				<CenteredPage centerX>
					<div className="p-16">
						<PageHeader text="Hi, I'm ORDO" />
					</div>
				</CenteredPage>
			</section>
		</main>
	)
}
