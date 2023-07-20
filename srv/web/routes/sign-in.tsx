import { PageHeader } from "../components/page-header.tsx"
import { CenteredPage } from "../components/centered-page.tsx"
import SignInForm from "../islands/sign-in-form.tsx"

export default function SignInPage() {
	return (
		<CenteredPage>
			<section class="w-full px-4 mx-auto text-center">
				<PageHeader>Sign in</PageHeader>
			</section>

			<section class="w-full px-4 py-8 mx-auto">
				<SignInForm />
			</section>
		</CenteredPage>
	)
}
