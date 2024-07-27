import { useMemo } from "react"

import { use$ } from ".."

export const useFetch = () => {
	const { get_fetch } = use$.ordo_context()

	const fetch = useMemo(get_fetch, [get_fetch])

	return fetch
}
