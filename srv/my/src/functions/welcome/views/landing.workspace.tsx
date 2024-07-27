import { use$ } from "@ordo-pink/frontend-react-hooks"

import AuthenticatedPage from "../pages/authenticated.page"
import UnauthenticatedPage from "../pages/unauthenticated.page"

export default function LandingWorkspace() {
	const is_authenticated = use$.is_authenticated()

	return is_authenticated ? <AuthenticatedPage /> : <UnauthenticatedPage />
}
