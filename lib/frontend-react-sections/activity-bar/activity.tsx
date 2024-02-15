// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Switch } from "@ordo-pink/switch"
import { currentActivity$ } from "@ordo-pink/frontend-stream-activities"
import { useSubscription } from "@ordo-pink/frontend-react-hooks"

import Link from "@ordo-pink/frontend-react-components/link"

import "./activity.css"
import { BsX } from "react-icons/bs"

/**
 * ActivityBarActivity is the Icon user can click to get to the activity.
 */
type P = { activity: Extensions.Activity }
export default function ActivityBarActivity({ activity }: P) {
	const currentActivity = useSubscription(currentActivity$)

	const activityRoute = activity.routes[0]
	const Icon = activity.Icon ?? BsX
	const className = Switch.of(currentActivity)
		.case(isCurrentActivity(activity), () => "activity active")
		.default(() => "activity")

	return (
		<Link className={className} href={activityRoute}>
			<Icon />
		</Link>
	)
}

// --- Internal ---

const isCurrentActivity =
	(activity: Extensions.Activity) => (currentActivity: Extensions.Activity | null) =>
		!!currentActivity && currentActivity.name === activity.name
