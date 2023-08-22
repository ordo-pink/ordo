import Link from "next/link"
import { CenteredPage } from "../components/centered-page"

export default function ForgotPasswordPage() {
	return (
		<CenteredPage centerX centerY>
			<h1 className="text-9xl font-black">404</h1>
			<p>
				The notfoundest page. <Link href="/">Go home</Link>.
			</p>
		</CenteredPage>
	)
}
