import { Suspense, lazy } from "react"

import { use$ } from "@ordo-pink/frontend-react-hooks"

import Loading from "@ordo-pink/frontend-react-components/loading-page"

export default function LandingWorkspace() {
	const is_authenticated = use$.is_authenticated()

	const Authenticated = lazy(() => import("../pages/authenticated.page"))
	const Unauthenticated = lazy(() => import("../pages/unauthenticated.page"))

	return (
		<Suspense fallback={<Loading />}>
			{is_authenticated ? <Authenticated /> : <Unauthenticated />}
		</Suspense>
	)
}
