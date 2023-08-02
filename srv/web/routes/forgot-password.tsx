import { Handlers, PageProps } from "$fresh/server.ts"
import { Switch } from "#lib/switch/mod.ts"
import { isEmail } from "#x/deno_validator@v0.0.5/mod.ts"
import { Button } from "../components/button.tsx"
import { Callout } from "../components/callout.tsx"
import { CenteredPage } from "../components/centered-page.tsx"
import { EmailInput } from "../components/input.tsx"
import { PageHeader } from "../components/page-header.tsx"

export default function ForgotPasswordPage({ url }: PageProps) {
	const error = url.searchParams.get("error")
	const success = url.searchParams.get("success")
	const text = "Please enter your email address to receive a password reset link."

	const ContextualCallout = Switch.of(true)
		.case(Boolean(error), () => () => <Callout type="error">{error}</Callout>)
		.case(Boolean(success), () => () => <Callout type="success">{success}</Callout>)
		.default(() => () => <Callout type="info">{text}</Callout>)

	// TODO: Send form to an island
	return (
		<CenteredPage
			centerX
			centerY
		>
			<div class="w-full max-w-sm">
				<section class="w-full px-4 mx-auto text-center">
					<PageHeader>Forgot password</PageHeader>
				</section>

				<section class="w-full px-4 py-8 mx-auto">
					<form
						method="post"
						class="w-full flex flex-col items-center space-y-12"
					>
						<div class="w-full flex flex-col space-y-6">
							{success ? null : (
								<fieldset class="w-full">
									<EmailInput />
								</fieldset>
							)}

							<legend class="w-full">
								<ContextualCallout />
							</legend>
						</div>

						{success ? null : (
							<div class="w-full flex flex-col">
								<Button>Send</Button>
							</div>
						)}

						{success ? null : (
							<div class="flex space-x-2">
								<a href="/sign-up">Not a member?</a>
								<div>|</div>
								<a href="/sign-in">Sign in?</a>
							</div>
						)}
					</form>
				</section>
			</div>
		</CenteredPage>
	)
}

export const handler: Handlers = {
	GET: (_, ctx) => ctx.render(),
	POST: async req => {
		const form = await req.formData()
		const email = form.get("email")?.toString()

		const headers = new Headers()

		if (!email || !isEmail(email, {})) {
			headers.set("Location", "/forgot-password?error=Invalid email.")
			return new Response(null, { status: 303, headers })
		}

		// TODO: Send request to id

		headers.set(
			"Location",
			"/forgot-password?success=Thank you! We will send you a recovery link if there is a user associated with the email you provided. You can close this page."
		)

		return new Response(null, { status: 303, headers })
	},
}
