// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	BsBox,
	BsChevronDown,
	BsChevronUp,
	BsClock,
	BsClockHistory,
	BsFiles,
	BsFolder2,
	BsTags,
} from "react-icons/bs"
import { ComponentType, MouseEventHandler, PropsWithChildren, useEffect, useState } from "react"
import { PiGraph, PiTreeStructure } from "react-icons/pi"

import { FSID, PlainData } from "@ordo-pink/data"
import {
	useChildren,
	useCommands,
	useDataByFSID,
	usePublicUserInfo,
	useReadableSize,
	useSelectDataList,
	useUser,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"

import DataLabel from "@ordo-pink/frontend-react-components/data-label"
import Link from "@ordo-pink/frontend-react-components/link"
import Null from "@ordo-pink/frontend-react-components/null"

type P = { data: PlainData }
export default function DataEditor({ data }: P) {
	const commands = useCommands()
	const user = useUser()
	const createdBy = usePublicUserInfo(data.createdBy)
	const updatedBy = usePublicUserInfo(data.updatedBy)
	const readableSize = useReadableSize(data)
	const parent = useDataByFSID(data.parent)
	const children = useChildren(data)
	const incomingLinks = useSelectDataList(item => item.links.includes(data.fsid))

	const creator = user && user.id === data.createdBy ? "Вы" : createdBy?.email ?? ""
	const createdAt = new Date(data.createdAt).toLocaleString("ru")

	const updater = user && user.id === data.updatedBy ? "Вы" : updatedBy?.email ?? ""
	const updatedAt = new Date(data.updatedAt).toLocaleString("ru")

	const handleLabelsClick = () =>
		commands.emit<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", data)

	const handleLinksClick = () =>
		commands.emit<cmd.data.showEditLinksPalette>("data.show-edit-links-palette", data)

	return (
		<table className="w-full table-fixed text-sm text-neutral-500">
			<tbody>
				<Row title="Размер" Icon={BsBox}>
					{readableSize}
				</Row>
				<Row title="Создан" Icon={BsClockHistory}>
					{creator} ({createdAt})
				</Row>
				<Row title="Последнее изменение" Icon={BsClock}>
					{updater} ({updatedAt})
				</Row>

				{Either.fromNullable(parent).fold(Null, parent => (
					<Row title="Родитель" Icon={BsFolder2}>
						<Link href={`/editor/${parent.fsid}`}>{parent.name}</Link>
					</Row>
				))}

				<ChildrenRow items={children} />

				<Row title="Входящие ссылки" Icon={PiGraph}>
					<div className="flex flex-wrap gap-1">
						{Either.fromBoolean(() => incomingLinks.length > 0).fold(
							() => (
								<div className="italic">Нет</div>
							),
							() => incomingLinks.map(link => <DataLink key={link.fsid} link={link.fsid} />),
						)}
					</div>
				</Row>

				<Row
					title="Исходящие ссылки"
					className="cursor-pointer"
					onClick={handleLinksClick}
					Icon={PiTreeStructure}
				>
					<div className="flex flex-wrap gap-1">
						{Either.fromBoolean(() => data.links.length > 0).fold(
							() => (
								<div className="italic">Добавить...</div>
							),
							() => data.links.map(link => <DataLink key={link} link={link} />),
						)}
					</div>
				</Row>

				<Row title="Метки" className="cursor-pointer" onClick={handleLabelsClick} Icon={BsTags}>
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
	Icon?: ComponentType
	onClick?: MouseEventHandler<HTMLTableRowElement>
	className?: string
}>
const Row = ({
	title,
	children,
	className = "",
	onClick = () => void 0,
	Icon = () => null,
}: RowP) => {
	return (
		<tr className={`table-row ${className}`} onClick={onClick}>
			<td className="flex py-1">
				<div className="flex items-center space-x-2">
					<Icon />
					<div>{title}</div>
				</div>
			</td>
			<td className="py-1">{children}</td>
		</tr>
	)
}

type DataLinkP = { link: FSID }
const DataLink = ({ link }: DataLinkP) => {
	const commands = useCommands()
	const data = useDataByFSID(link)

	return Either.fromNullable(data).fold(Null, data => (
		<DataLabel>
			<div
				className="cursor-pointer"
				onClick={event => {
					event.stopPropagation()
					commands.emit<cmd.router.navigate>("router.navigate", `/editor/${link}`)
				}}
			>
				{data.name}
			</div>
		</DataLabel>
	))
}

type ChildrenRowP = { items: PlainData[] }
const ChildrenRow = ({ items }: ChildrenRowP) => {
	const commands = useCommands()
	const [isCollapsed, setIsCollapsed] = useState(true)
	const [shouldCollapse, setShouldCollapse] = useState(false)

	useEffect(() => setShouldCollapse(items.length > 2), [items])

	return Either.fromBoolean(() => items.length > 0).fold(Null, () => (
		<Row title="Вложенные файлы" Icon={BsFiles}>
			<div className="flex flex-wrap gap-1">
				{(shouldCollapse && isCollapsed ? items.slice(0, 2) : items).map(child => (
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
				{shouldCollapse && isCollapsed ? (
					<DataLabel>
						<div
							className="flex cursor-pointer items-center space-x-1"
							onClick={() => setIsCollapsed(false)}
						>
							<BsChevronDown />
							<span>Показать ещё {items.length - 2}</span>
						</div>
					</DataLabel>
				) : null}
				{shouldCollapse && !isCollapsed ? (
					<DataLabel>
						<div
							className="flex cursor-pointer items-center space-x-1"
							onClick={() => setIsCollapsed(true)}
						>
							<BsChevronUp />
							<span>Свернуть</span>
						</div>
					</DataLabel>
				) : null}
			</div>
		</Row>
	))
}
