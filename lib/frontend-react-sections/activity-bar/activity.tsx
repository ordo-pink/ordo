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
