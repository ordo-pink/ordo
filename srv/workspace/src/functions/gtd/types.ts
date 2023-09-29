// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID, PlainData } from "@ordo-pink/data"

export namespace GTDCommands {
	export type openInbox = { name: "gtd.open-inbox" }
	export type openArchive = { name: "gtd.open-archive" }
	export type openItem = { name: "gtd.open-item"; payload: FSID }
	export type showAddReminderModal = { name: "gtd.show-quick-reminder-modal" }
	export type addQuickReminder = {
		name: "gtd.add-quick-reminder"
		payload: { name: string; inboxFsid: FSID }
	}
	export type markDone = { name: "gtd.mark-done"; payload: PlainData }
	export type markNotDone = { name: "gtd.mark-not-done"; payload: PlainData }
	export type move = { name: "gtd.move"; payload: { fsid: FSID; parent: FSID } }
	export type moveToInbox = { name: "gtd.move-to-inbox"; payload: FSID }
	export type archive = { name: "gtd.archive"; payload: FSID }
	export type unarchive = { name: "gtd.unarchive"; payload: FSID }
	export type archiveDone = { name: "gtd.archive-done"; payload: FSID }
}
