import { useEffect, useState } from "react"

import { Either } from "@ordo-pink/either"
import { type PlainData } from "@ordo-pink/data"
import { useData } from "@ordo-pink/frontend-react-hooks"

import { GTDRepository } from "../gtd.repository"

export const useInbox = () => {
	const data = useData()

	const [items, setItems] = useState<PlainData[]>([])

	useEffect(() => {
		Either.fromNullable(data)
			.map(GTDRepository.getInbox)
			.fold(() => setItems([]), setItems)

		return () => {
			setItems([])
		}
	}, [data])

	return items
}