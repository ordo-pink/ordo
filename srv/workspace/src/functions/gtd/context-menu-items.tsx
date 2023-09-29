// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import FileIconComponent from "$functions/file-explorer/components/file-icon.component"
import { PlainData } from "@ordo-pink/data"
import { CommandPalette, Commands, CtxMenu, cmd } from "@ordo-pink/frontend-core"
import { BsArrowRightSquare, BsNodePlus, BsPencilSquare, BsTags, BsTagsFill } from "react-icons/bs"

const rename: CtxMenu.Item = {
	cmd: "data.show-rename-modal",
	Icon: BsPencilSquare,
	readableName: "Rename",
	shouldShow: ({ payload }) => payload && payload.fsid && payload.name && payload.name !== ".inbox",
	type: "update",
}

const addLabelPalette: CtxMenu.Item = {
	cmd: "data.show-add-label-palette",
	Icon: BsTags,
	readableName: "Add label",
	shouldShow: ({ payload }) => payload && payload.fsid && payload.name,
	type: "update",
}

const removeLabelPalette: CtxMenu.Item = {
	cmd: "data.show-remove-label-palette",
	Icon: BsTagsFill,
	readableName: "Remove label",
	shouldShow: ({ payload }) => payload && payload.fsid && payload.name,
	type: "update",
	shouldBeDisabled: ({ payload }) => payload.labels.length === 0,
}

const createModal: CtxMenu.Item = {
	cmd: "data.show-create-modal",
	Icon: BsNodePlus,
	readableName: "Add",
	shouldShow: ({ payload }) => payload && payload.fsid,
	type: "create",
}

const move = (data: PlainData[] | null, commands: Commands.Commands): CtxMenu.Item => ({
	cmd: "command-palette.show",
	Icon: BsArrowRightSquare,
	readableName: "Move...",
	shouldShow: ({ payload }) => payload && payload.fsid && payload.name && payload.name !== ".inbox",
	payloadCreator: ({ payload }) => ({
		items: data?.map(
			item =>
				({
					id: item.name,
					readableName: item.name,
					onSelect: () => {
						commands.emit<cmd.data.move>("data.move", { parent: item.fsid, fsid: payload.fsid })
						commands.emit<cmd.modal.hide>("modal.hide")
					},
					Icon: () => <FileIconComponent plain={item} />,
				}) satisfies CommandPalette.Item,
		),
	}),
	type: "update",
})

export const GTDCtxMenu = {
	rename,
	addLabelPalette,
	removeLabelPalette,
	createModal,
	move,
}
