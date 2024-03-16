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

import { FSID } from "@ordo-pink/data"

declare global {
	module cmd {
		module gtd {
			type openInbox = { name: "gtd.open-inbox" }
			type openProject = { name: "gtd.open-project"; payload: FSID }
			type showQuickReminderModal = { name: "gtd.show-quick-reminder-modal" }
			type addToProjects = { name: "gtd.add-to-projects"; payload: FSID }
			type removeFromProjects = { name: "gtd.remove-from-projects"; payload: FSID }
			type markDone = { name: "gtd.mark-done"; payload: FSID }
			type markNotDone = { name: "gtd.mark-not-done"; payload: FSID }
		}
	}
}
