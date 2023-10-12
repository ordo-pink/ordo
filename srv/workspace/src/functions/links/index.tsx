import { Activity, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { PiGraph } from "react-icons/pi"
import LinksComponent from "./components/links.component"

export default function createLinksFunction({ commands, data$ }: Functions.CreateFunctionParams) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: ({ space }) => <Component space={space} commands={commands} />,
		Sidebar: () => <h1>Hello</h1>,
		name: "links",
		routes: ["/links"],
		background: false,
	})
}

const Component = ({ space }: Activity.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <PiGraph />)
		.default(() => <LinksComponent />)
