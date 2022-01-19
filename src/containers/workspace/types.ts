import { OrdoEvent } from "../../common/types"

export type WORKSPACE_SCOPE = "workspace"

export type WorkspaceEvent = OrdoEvent<WORKSPACE_SCOPE, "set-component", string>

export type WorkspaceState = {
	component: string
}
