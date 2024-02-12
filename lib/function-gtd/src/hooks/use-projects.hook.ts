import { useEffect, useState } from "react"

import { Either } from "@ordo-pink/either"
import { type PlainData } from "@ordo-pink/data"
import { useData } from "@ordo-pink/frontend-react-hooks"

import { GTDRepository } from "../gtd.repository"

export const useProjects = () => {
	const data = useData()

	const [items, setItems] = useState<PlainData[]>([])

	useEffect(() => {
		Either.fromNullable(data)
			.map(GTDRepository.getProjects)
			.fold(() => setItems([]), setItems)

		return () => {
			setItems([])
		}
	}, [data])

	return items
}
