import Null from "$components/null"
import { useChildren } from "$hooks/use-children"
import { FSID, PlainData } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import DirectoryCardComponent from "./directory-card.component"
import FileCardComponent from "./file-card.component"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"

type P = { data: PlainData; isSelected: boolean; onSelect: (fsid: FSID) => void }
export default function FSDataIcon({ data, isSelected, onSelect }: P) {
	const { commands } = useSharedContext()
	const children = useChildren(data)

	const element = Switch.of(true)
		.case(children.length > 0, () => <DirectoryCardComponent plain={data} />)
		.case(children.length === 0, () => <FileCardComponent plain={data} />)
		.default(Null)

	return (
		<div
			className={`cursor-pointer w-24 max-h-min select-none p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-900 ${
				isSelected
					? "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-300 hover:dark:bg-neutral-700"
					: ""
			}`}
			onClick={() => onSelect(data.fsid)}
			onDoubleClick={() => {
				if (children.length)
					return commands.emit<cmd.router.navigate>("router.navigate", `/fs/${data.fsid}`)
				alert("TODO")
			}}
		>
			{element}
		</div>
	)
}
