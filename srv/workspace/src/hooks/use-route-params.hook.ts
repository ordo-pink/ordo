import { useSharedContext } from "@ordo-pink/frontend-core"

export const useRouteParams = <
	ExpectedRouteParams extends Record<string, string> = Record<string, string>,
>(): Partial<ExpectedRouteParams> => {
	const { route } = useSharedContext()

	return (route?.params ?? {}) as Partial<ExpectedRouteParams>
}
