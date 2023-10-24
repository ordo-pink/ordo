// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Extensions, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { BsLayoutTextSidebarReverse } from "react-icons/bs"
import EditorSidebar from "./components/editor-sidebar.component"

export default function createEditorFunction({ commands, data$ }: Functions.CreateFunctionParams) {
	commands.on<cmd.data.uploadContent>

	commands.emit<cmd.activities.add>("activities.add", {
		Component: ({ space }) => <Component space={space} />,
		Sidebar: EditorSidebar,
		name: "editor",
		routes: ["/editor", "/editor/:fsid"],
		background: false,
	})
}

const Component = ({ space }: Extensions.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <BsLayoutTextSidebarReverse />)
		.default(() => <h1>Hello</h1>)
