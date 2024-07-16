// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Descendant, Element } from "slate"

import { FSID } from "@ordo-pink/data"
import { TNodeType } from "./editor.constants"

declare global {
	module cmd {
		module activities {
			type register = {
				name: "activities.register"
				payload: { fid: symbol; activity: Functions.Activity }
			}
			type unregister = {
				name: "activities.unregister"
				payload: { fid: symbol; name: string }
			}
		}

		module editor {
			type goToEditor = { name: "editor.go-to-editor" }
			type open = { name: "editor.open"; payload: FSID }
			type registerFileAssociation = {
				name: "editor.register-file-association"
				payload: Functions.FileAssociation
			}
			type unregisterFileAssociation = {
				name: "editor.unregister-file-association"
				payload: Functions.FileAssociation["name"]
			}
		}
	}
}

export type OrdoDescendant = Descendant & { type: TNodeType }
export type OrdoElement = Element & { type: TNodeType }

export {}
