import { useState, useEffect } from "react"
import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { TUsedSpaceModel } from "./used-space.types"

export const useModel = (): TUsedSpaceModel => {
	const { data, user } = useSharedContext()

	const [currentSize, setCurrentSize] = useState(0)
	const [totalSize, setTotalSize] = useState(0)

	useEffect(
		() =>
			Either.fromNullable(data)
				.chain(data => Either.fromNullable(user).map(user => ({ data, user })))
				.fold(
					() => {
						setCurrentSize(0)
						setTotalSize(0)
					},
					({ data, user }) => {
						setCurrentSize(data.length)
						setTotalSize(user.fileLimit)
					},
				),
		[data, user],
	)

	return { currentSize, totalSize }
}
