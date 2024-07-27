import { useMemo } from "react"

import { use$ } from ".."

export const useIsDev = () => {
	const { is_dev } = use$.ordo_context()

	const memoised = useMemo(() => is_dev, [is_dev])

	return memoised
}
