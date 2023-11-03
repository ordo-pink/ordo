import DataLabel from "$components/data/label.component"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { PropsWithChildren } from "react"

type P = { data: PlainData }
export default function DataEditor({ data }: P) {
	const { commands } = useSharedContext()

	const handleLabelsClick = () =>
		commands.emit<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", data)

	return (
		<table className="w-full table-fixed text-neutral-500 text-sm">
			<tbody>
				<Row title="Размер">{data.size}B</Row>
				<Row title="Создан">{new Date(data.createdAt).toLocaleString()}</Row>
				<Row title="Автор">{data.createdBy}</Row>
				<Row title="Последнее изменение">
					{data.updatedBy}
					<br />({new Date(data.updatedAt).toLocaleString()})
				</Row>

				<Row title="Ссылки">
					<div className="flex flex-wrap gap-1">
						{data.links.map(link => (
							<DataLabel key={link}>{link}</DataLabel>
						))}
					</div>
				</Row>
				<Row title="Метки">
					<div className="flex flex-wrap gap-1" onClick={handleLabelsClick}>
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
