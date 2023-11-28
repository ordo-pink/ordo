// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID } from "@ordo-pink/data"

declare global {
	module cmd {
		module gtd {
			type openInbox = { name: "gtd.open-inbox" }
			type openProject = { name: "gtd.open-project"; payload: FSID }
			type showInGTD = { name: "gtd.show-in-gtd"; payload: FSID }
			type showAddReminderModal = { name: "gtd.show-quick-reminder-modal" }
			type addToGTD = { name: "gtd.add-to-gtd"; payload: FSID }
			type removeFromGTD = { name: "gtd.remove-from-gtd"; payload: FSID }
			type markDone = { name: "gtd.mark-done"; payload: FSID }
			type markNotDone = { name: "gtd.mark-not-done"; payload: FSID }
		}
	}
}
