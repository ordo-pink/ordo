import { BsFileEarmark, BsFolder2 } from "react-icons/bs"

import { PlainData } from "@ordo-pink/data"
import { useChildren } from "@ordo-pink/frontend-react-hooks"

type P = { plain: PlainData }
export default function DataIcon({ plain }: P) {
	const children = useChildren(plain)
	return children.length > 0 ? (
		<BsFolder2 className="size-full" />
	) : (
		<BsFileEarmark className="size-full" />
	)
}
