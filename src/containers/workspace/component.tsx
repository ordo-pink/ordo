import React from "react"
import { components } from "../../components/components"
import { WorkspaceState } from "./types"

export const Workspace: React.FC<WorkspaceState> = ({ component }) => {
	const Component = (components as any)[component]

	return <Component />
}
