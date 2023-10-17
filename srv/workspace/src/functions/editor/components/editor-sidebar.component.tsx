import ActionListItem from "$components/action-list-item"
import { Loading } from "$components/loading/loading"
import FSDataIcon from "$functions/file-explorer/components/data-icon.component"
import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { BsFileEarmark } from "react-icons/bs"

export default function EditorSidebar() {
	const { route, data } = useSharedContext()

	return Either.fromNullable(data).fold(Loading, data => (
		<div>
			{data.map(item => (
				<ActionListItem key={item.fsid} Icon={BsFileEarmark} current={false} text={item.name} />
			))}
		</div>
	))
}
