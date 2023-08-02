import { PageHeader } from "../components/page-header.tsx"
import { CenteredPage } from "../components/centered-page.tsx"
import SignUpForm from "../islands/sign-up-form.tsx"

export default function SignUpPage() {
	return (
		<CenteredPage
			centerX
			centerY
		>
			<section class="w-full px-4 mx-auto text-center">
				<PageHeader>Sign up</PageHeader>
			</section>

			<section class="w-full px-4 py-8 mx-auto">
				<SignUpForm />
			</section>
		</CenteredPage>
	)
}
