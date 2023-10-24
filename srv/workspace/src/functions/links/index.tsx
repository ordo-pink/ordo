// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Extensions, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { PiGraph } from "react-icons/pi"
import LinksSidebar from "./components/links-sidebar.component"
import LinksWorkspace from "./components/links-workspace.component"

export default function createLinksFunction({ commands, data$ }: Functions.CreateFunctionParams) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: ({ space }) => <Component space={space} commands={commands} />,
		Sidebar: LinksSidebar,
		name: "links",
		routes: ["/links", "/links/:label"],
		background: false,
	})
}

const Component = ({ space }: Extensions.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <PiGraph />)
		.default(() => <LinksWorkspace />)
