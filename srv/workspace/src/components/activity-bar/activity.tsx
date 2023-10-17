// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { __CurrentActivity$ } from "$streams/activities"
import Link from "$components/link"
import { getCommands } from "$streams/commands"
import { Extensions, ComponentSpace } from "@ordo-pink/frontend-core"
import { useSubscription } from "$hooks/use-subscription"

const commands = getCommands()

type Props = {
	activity: Extensions.Activity
	currentActivity$: __CurrentActivity$
}

/**
 * ActivityBarActivity is the Icon user can click to get to the activity.
 */
export default function ActivityBarActivity({ activity, currentActivity$ }: Props) {
	const currentActivity = useSubscription(currentActivity$)

	const activityRoute = activity.routes[0]
	const Icon = activity.Component

	return (
		<Link
			className={`!text-neutral-700 dark:!text-neutral-300 hover:!text-purple-600 dark:hover:!text-purple-400 transition-all duration-300 text-2xl leading-[0] rounded-lg ${
				currentActivity && currentActivity.name === activity.name
					? "!text-pink-700 dark:!text-pink-500 hover:!text-purple-600 dark:hover:!text-purple-400"
					: ""
			}`}
			href={activityRoute}
		>
			<Icon commands={commands} space={ComponentSpace.ICON} />
		</Link>
	)
}
