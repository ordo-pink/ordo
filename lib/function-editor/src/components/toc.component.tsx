// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BsLink45Deg } from "react-icons/bs"
import { RenderElementProps } from "slate-react"

import { FSID, PlainData } from "@ordo-pink/data"
import { useChildren, useDataByFSID } from "@ordo-pink/frontend-react-hooks"

import { fromNullableE } from "@ordo-pink/either"

import Link from "@ordo-pink/frontend-react-components/link"

export default function ToC({ children, attributes, fsid }: RenderElementProps & { fsid: FSID }) {
	const data = useDataByFSID(fsid)

	return fromNullableE(data).fold(
		() => <span {...attributes}>{children}</span>,
		item => (
			<div
				{...attributes}
				className="rounded-md bg-white p-4 shadow-sm dark:bg-black"
				contentEditable={false}
			>
				<div className="mb-2 text-center text-sm text-neutral-500">Содержание</div>
				<Node node={item} />
				{children}
			</div>
		),
	)
}

const Node = ({ node }: { node: PlainData }) => {
	const children = useChildren(node.fsid)

	return (
		<div>
			<Link
				class_name="cursor-pointer text-sm text-neutral-700 no-underline visited:text-neutral-700 hover:!text-rose-500 dark:text-neutral-300 dark:visited:text-neutral-300"
				href={`/editor/${node.fsid}`}
			>
				{node.name}
			</Link>
			<div className="pl-2">
				{children.map(child => (
					<div key={child.fsid} className="flex cursor-pointer items-center space-x-2">
						<BsLink45Deg />
						<Node node={child} />
					</div>
				))}
			</div>
		</div>
	)
}
