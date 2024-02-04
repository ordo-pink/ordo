// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ComponentSpace } from "@ordo-pink/core"
import { useCommands } from "@ordo-pink/frontend-stream-commands"
import { useSubscription } from "@ordo-pink/frontend-react-hooks"

import Link from "@ordo-pink/frontend-react-components/link"

type Props = {
	activity: Extensions.Activity
	currentActivity$: __CurrentActivity$
}

/**
 * ActivityBarActivity is the Icon user can click to get to the activity.
 */
export default function ActivityBarActivity({ activity, currentActivity$ }: Props) {
	const commands = useCommands()
	const currentActivity = useSubscription(currentActivity$)

	const activityRoute = activity.routes[0]
	const Icon = activity.Component

	return (
		<Link
			className={`rounded-lg text-2xl leading-[0] !text-neutral-700 transition-all duration-300 hover:!text-purple-600 dark:!text-neutral-300 dark:hover:!text-purple-400 ${
				currentActivity && currentActivity.name === activity.name
					? "!text-pink-700 hover:!text-purple-600 dark:!text-pink-500 dark:hover:!text-purple-400"
					: ""
			}`}
			href={activityRoute}
		>
			<Icon commands={commands} space={ComponentSpace.ICON} />
		</Link>
	)
}
