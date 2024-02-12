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
