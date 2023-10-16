import { Activity, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { PiGraph } from "react-icons/pi"
import LinksComponent from "./components/links.component"
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

const Component = ({ space }: Activity.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <PiGraph />)
		.default(() => <LinksWorkspace />)
