// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useStrictSubscription } from "$hooks/use-subscription"
import { __Notification$ } from "$streams/notification"
import { Notification } from "@ordo-pink/frontend-core"
import NotificationComponent from "./notification.component"

type _P = { notification$: __Notification$ }
export default function Notifications({ notification$ }: _P) {
	const notifications = useStrictSubscription(notification$, [] as Notification.RegisterredItem[])

	return (
		<div className="fixed bottom-0 right-0 flex flex-col space-y-2 p-2 w-full max-w-sm">
			{notifications.map(notification => (
				<NotificationComponent key={notification.id} notification={notification} />
			))}
		</div>
	)
}
