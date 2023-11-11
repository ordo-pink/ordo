import DataLabel from "$components/data/label.component"
import Link from "$components/link"
import Null from "$components/null"
import { useChildren } from "$hooks/use-children"
import { useDataByFSID } from "$hooks/use-data.hook"
import { usePublicUserInfo } from "$hooks/use-public-user-info.hook"
import { UserUtils } from "$utils/user-utils.util"
import { FSID, PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEventHandler, PropsWithChildren } from "react"

type P = { data: PlainData }
export default function DataEditor({ data }: P) {
	const { commands } = useSharedContext()
	const createdBy = usePublicUserInfo(data.createdBy)
	const updatedBy = usePublicUserInfo(data.updatedBy)
	const parent = useDataByFSID(data.parent)
	const children = useChildren(data)

	const handleLabelsClick = () =>
		commands.emit<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", data)

	const handleLinksClick = () =>
		commands.emit<cmd.data.showEditLinksPalette>("data.show-edit-links-palette", data)

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
				{Either.fromNullable(parent).fold(Null, parent => (
					<Row title="Родитель">
						<Link href={`/editor/${parent.fsid}`}>{parent.name}</Link>
					</Row>
				))}
				{Either.fromBoolean(() => children.length > 0).fold(Null, () => (
					<Row title="Вложенные файлы">
						<div className="flex flex-wrap gap-1">
							{children.map(child => (
								<DataLabel key={child.fsid}>
									<div
										className="cursor-pointer"
										onClick={() =>
											commands.emit<cmd.router.navigate>("router.navigate", `/editor/${child.fsid}`)
										}
									>
										{child.name}
									</div>
								</DataLabel>
							))}
						</div>
					</Row>
				))}
				<Row title="Ссылки" className="cursor-pointer" onClick={handleLinksClick}>
					<div className="flex flex-wrap gap-1">
						{Either.fromBoolean(() => data.links.length > 0).fold(
							() => (
								<div className="italic">Добавить...</div>
							),
							() => data.links.map(link => <DataLink key={link} link={link} />),
						)}
					</div>
				</Row>
				<Row title="Метки" className="cursor-pointer" onClick={handleLabelsClick}>
					<div className="flex flex-wrap gap-1">
						{Either.fromBoolean(() => data.labels.length > 0).fold(
							() => (
								<div className="italic">Добавить...</div>
							),
							() => data.labels.map(label => <DataLabel key={label}>{label}</DataLabel>),
						)}
					</div>
				</Row>
			</tbody>
		</table>
	)
}

type RowP = PropsWithChildren<{
	title: string
	onClick?: MouseEventHandler<HTMLTableRowElement>
	className?: string
}>
const Row = ({ title, children, className = "", onClick = () => void 0 }: RowP) => {
	return (
		<tr className={`table-row ${className}`} onClick={onClick}>
			<td className="flex py-1">{title}</td>
			<td className="py-1">{children}</td>
		</tr>
	)
}

type DataLinkP = { link: FSID }
const DataLink = ({ link }: DataLinkP) => {
	const { commands } = useSharedContext()
	const data = useDataByFSID(link)

	return Either.fromNullable(data).fold(Null, data => (
		<DataLabel>
			<div
				className="cursor-pointer"
				onClick={() => commands.emit<cmd.router.navigate>("router.navigate", `/editor/${link}`)}
			>
				{data.name}
			</div>
		</DataLabel>
	))
}
