import { PlainData } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"

type P = { plain: PlainData }

export default function ContentType({ plain }: P) {
	return Switch.of(plain.contentType)
		.case(
			x => !x || x === "text/ordo",
			() => (
				<div className="px-1 py-0.5 rounded-lg shadow-md text-xs bg-sky-200 dark:bg-sky-800">
					Текст
				</div>
			),
		)
		.default(() => <div>{plain.contentType}</div>)
}
