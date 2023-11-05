import DataLabel from "$components/data/label.component"
import { usePublicUserInfo } from "$hooks/use-public-user-info.hook"
import { UserUtils } from "$utils/user-utils.util"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { PropsWithChildren } from "react"

type P = { data: PlainData }
export default function DataEditor({ data }: P) {
	const { commands } = useSharedContext()
	const createdBy = usePublicUserInfo(data.createdBy)
	const updatedBy = usePublicUserInfo(data.updatedBy)

	const handleLabelsClick = () =>
		commands.emit<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", data)

	return (
		<table className="w-full table-fixed text-neutral-500 text-sm">
			<tbody>
				<Row title="Размер">{data.size}B</Row>
				<Row title="Создан">
					{UserUtils.getUserName(createdBy)} ({new Date(data.createdAt).toLocaleString()})
				</Row>
				<Row title="Последнее изменение">
					{UserUtils.getUserName(updatedBy)} ({new Date(data.updatedAt).toLocaleString()})
				</Row>

				<Row title="Ссылки">
					<div className="flex flex-wrap gap-1 cursor-pointer">
						{data.links.map(link => (
							<DataLabel key={link}>{link}</DataLabel>
						))}
					</div>
				</Row>
				<Row title="Метки">
					<div className="flex flex-wrap gap-1 cursor-pointer" onClick={handleLabelsClick}>
						{data.labels.map(label => (
							<DataLabel key={label}>{label}</DataLabel>
						))}
					</div>
				</Row>
			</tbody>
		</table>
	)
}

type RowP = PropsWithChildren<{ title: string }>
const Row = ({ title, children }: RowP) => {
	return (
		<tr className="table-row">
			<td className="flex py-1">{title}</td>
			<td className="py-1">{children}</td>
		</tr>
	)
}
