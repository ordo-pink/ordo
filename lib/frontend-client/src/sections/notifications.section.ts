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

import { Subject } from "rxjs/internal/Subject"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { TInitCtx } from "../frontend-client.types"

type P = Pick<TInitCtx, "logger" | "commands">
export const init_notifications = ({ logger, commands }: P) => {
	logger.debug("🟡 Initialising notifications...")

	const notification_list_element = document.querySelector("#notifications") as HTMLDivElement
	const rendered_notifications: string[] = []

	notification$.subscribe(notifications => {
		for (const notification of notifications) {
			if (rendered_notifications.includes(notification.id)) continue
			const notification_type = notification.type ?? "default"

			const notification_element = document.createElement("div")
			notification_element.classList.add("relative", "inset-x-0", "z-50", "size-full")
			notification_element.dataset.id = notification.id

			if (notification.on_click) {
				notification_element.classList.add("cursor-pointer")
				notification_element.onclick = notification.on_click
			}

			const card_element = document.createElement("div")
			card_element.classList.add(
				"flex",
				"w-full",
				"max-w-lg",
				"items-center",
				"gap-x-4",
				"rounded-lg",
				"px-4",
				"py-2",
				"shadow-sm",
				...CardClass[notification_type],
			)

			const content_wrapper_element = document.createElement("div")
			content_wrapper_element.classList.add("w-full", "text-sm")

			if (notification.icon) {
				const icon_wrapper_element = document.createElement("div")
				icon_wrapper_element.classList.add("size-16", "shrink-0", "rounded-sm")
				icon_wrapper_element.innerHTML = notification.icon
				card_element.appendChild(icon_wrapper_element)
			} else card_element.innerHTML = DefaultIcon[notification_type]

			if (notification.title) {
				const title_element = document.createElement("h4")
				title_element.classList.add("font-bold")
				title_element.innerText = notification.title
				content_wrapper_element.appendChild(title_element)
			}

			const message_element = document.createElement("p")
			message_element.innerText = notification.message
			content_wrapper_element.appendChild(message_element)

			const close_element = document.createElement("button")
			close_element.classList.add(
				"absolute",
				"right-2",
				"top-2",
				"rounded-full",
				"p-1",
				...HoverCloseButtonClass[notification_type],
			)
			close_element.onclick = event => {
				event.preventDefault()
				commands.emit("cmd.application.notification.hide", notification.id)
			}
			close_element.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
</svg>`
			content_wrapper_element.appendChild(close_element)

			let interval: number

			if (notification.duration) {
				const progress_container = document.createElement("div")
				progress_container.classList.add(
					"absolute",
					"inset-x-1.5",
					"bottom-0",
					"rounded-full",
					"shadow-inner",
					...ProgressContainerClass[notification_type],
				)

				let percentage = 100

				if (percentage === -1) percentage = 100

				interval = setInterval(() => {
					percentage = percentage > 0 ? percentage - 1 : 0

					const progress = document.createElement("div")
					progress.classList.add("h-1", "rounded-full", ...ProgressClass[notification_type])
					progress.style.width = percentage.toFixed(0).concat("%")

					progress_container.innerHTML = ""
					progress_container.appendChild(progress)

					content_wrapper_element.appendChild(progress_container)

					if (percentage === 0) {
						clearInterval(interval)
						commands.emit("cmd.application.notification.hide", notification.id)
					}
				}, notification.duration * 10) as unknown as number
			}

			card_element.appendChild(content_wrapper_element)
			notification_element.appendChild(card_element)
			notification_list_element.appendChild(notification_element)

			rendered_notifications.push(notification.id)
		}
	})

	commands.on("cmd.application.notification.show", payload =>
		add$.next({ ...payload, id: payload.id ?? crypto.randomUUID() }),
	)
	commands.on("cmd.application.notification.hide", payload => {
		notification_list_element.removeChild(document.querySelector(`[data-id="${payload}"]`)!)
	})

	logger.debug("🟢 Initialised notifications.")
}

// --- Internal ---

const addP = (i: Client.Notification.Item) => (is: Client.Notification.Item[]) =>
	is.some(({ id }) => id === i.id) ? is : [...is, i]
const removeP = (id: string) => (is: Client.Notification.Item[]) => is.filter(a => a.id !== id)

const add$ = new Subject<Client.Notification.Item>()
const remove$ = new Subject<string>()
const notification$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as Client.Notification.Item[]),
	shareReplay(1),
)

const HoverCloseButtonClass: Record<Client.Notification.Type, string[]> = {
	default: ["hover:bg-neutral-300", "hover:dark:bg-neutral-900"],
	info: ["hover:bg-sky-300", "hover:dark:bg-sky-900"],
	question: ["hover:bg-violet-300", "hover:dark:bg-violet-900"],
	rrr: ["hover:bg-rose-300", "hover:dark:bg-rose-900"],
	success: ["hover:bg-emerald-300", "hover:dark:bg-emerald-900"],
	warn: ["hover:bg-amber-300", "hover:dark:bg-amber-900"],
}

const DefaultIcon: Record<Client.Notification.Type, string> = {
	info: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="shrink-0 text-xl text-sky-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
</svg>`,
	warn: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="shrink-0 text-xl text-amber-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path>
</svg>`,
	success: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="shrink-0 text-xl text-emerald-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"></path>
</svg>`,
	question: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="shrink-0 text-xl text-violet-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"></path>
</svg>`,
	rrr: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="shrink-0 text-xl text-rose-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
</svg>`,
	default: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="shrink-0 text-xl text-neutral-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
</svg>`,
}

const CardClass: Record<Client.Notification.Type, string[]> = {
	default: ["bg-neutral-200", "dark:bg-neutral-600"],
	info: ["bg-sky-100", "dark:bg-sky-800"],
	question: ["bg-violet-100", "dark:bg-violet-800"],
	rrr: ["bg-rose-100", "dark:bg-rose-800"],
	success: ["bg-emerald-100", "dark:bg-emerald-800"],
	warn: ["bg-amber-100", "dark:bg-amber-800"],
}

const ProgressContainerClass: Record<Client.Notification.Type, string[]> = {
	default: ["bg-neutral-300", "dark:bg-neutral-900"],
	info: ["bg-sky-300", "dark:bg-sky-900"],
	question: ["bg-violet-300", "dark:bg-violet-900"],
	rrr: ["bg-rose-300", "dark:bg-rose-900"],
	success: ["bg-emerald-300", "dark:bg-emerald-900"],
	warn: ["bg-amber-300", "dark:bg-amber-900"],
}

const ProgressClass: Record<Client.Notification.Type, string[]> = {
	default: ["bg-neutral-100", "dark:bg-neutral-800"],
	info: ["bg-sky-100", "dark:bg-sky-800"],
	question: ["bg-violet-100", "dark:bg-violet-800"],
	rrr: ["bg-rose-100", "dark:bg-rose-800"],
	success: ["bg-emerald-100", "dark:bg-emerald-800"],
	warn: ["bg-amber-100", "dark:bg-amber-800"],
}
