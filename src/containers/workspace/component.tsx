import React from "react"
import { WindowState } from "../../common/types"
import { components } from "../../components/components"

export const Workspace: React.FC<{ state: WindowState }> = ({ state }) => {
	const Component = (components as any)[state.workspace.component]

	return <Component {...state} />
}
