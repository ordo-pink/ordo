import React from "react"
import { useAppSelector } from "../../common/store-hooks"
import { components } from "../../components/components"

export const Workspace: React.FC = () => {
	const component = useAppSelector((state) => state.workspace.component)

	const Component = (components as any)[component || "WelcomePage"]

	return <Component />
}
