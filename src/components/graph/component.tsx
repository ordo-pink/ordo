import React from "react"
import { WindowState } from "../../common/types"

export const Graph: React.FC<WindowState> = ({ application }) => <div>{application.cwd}</div>
