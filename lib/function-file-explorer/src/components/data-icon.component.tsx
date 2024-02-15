import { FSID, PlainData } from "@ordo-pink/data"
import { useChildren, useCommands } from "@ordo-pink/frontend-react-hooks"
import { Switch } from "@ordo-pink/switch"

import Null from "@ordo-pink/frontend-react-components/null"

import DirectoryCardComponent from "./directory-card.component"
import FileCardComponent from "./file-card.component"

type P = { data: PlainData; isSelected: boolean; onSelect: (fsid: FSID) => void }
export default function FSDataIcon({ data, isSelected, onSelect }: P) {
	const commands = useCommands()
	const children = useChildren(data)

	const element = Switch.empty()
		.case(children.length > 0, () => <DirectoryCardComponent plain={data} />)
		.case(children.length === 0, () => <FileCardComponent plain={data} />)
		.default(Null)

	return (
		<div
			className={`max-h-min w-24 cursor-pointer select-none rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-900 ${
				isSelected
					? "bg-neutral-300 hover:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-700"
					: ""
			}`}
			onClick={() => onSelect(data.fsid)}
			onDoubleClick={() => {
				if (children.length)
					return commands.emit<cmd.router.navigate>("router.navigate", `/fs/${data.fsid}`)

				commands.emit<cmd.router.navigate>("router.navigate", `/editor/${data.fsid}`)
			}}
		>
			{element}
		</div>
	)
}
