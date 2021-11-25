import React from "react"
import { select, Selection } from "d3"

export function useD3(
	renderFunction: (
		selection: Selection<any, any, any, any>,
		ref: React.MutableRefObject<any>,
	) => void,
	dependencies: any[],
): React.MutableRefObject<any> {
	const ref = React.useRef(null)

	React.useEffect(() => {
		if (!ref.current) {
			return
		}

		renderFunction(select(ref.current), ref.current)
	}, [...dependencies, ref.current])

	return ref
}
