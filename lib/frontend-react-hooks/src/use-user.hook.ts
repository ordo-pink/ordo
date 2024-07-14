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

import { KnownFunctions, TQueryPermission } from "@ordo-pink/frontend-known-functions"
import { N } from "@ordo-pink/tau"
import { Switch } from "@ordo-pink/switch"
import { achievements$ } from "@ordo-pink/frontend-stream-achievements"
import { fromBooleanE } from "@ordo-pink/either"
import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"
import { user$ } from "@ordo-pink/frontend-stream-user"

import { useStrictSubscription } from "./use-strict-subscription.hook"
import { useSubscription } from "./use-subscription.hook"

export const useUser = () => {
	const fid = useCurrentFID()
	const user = useSubscription(user$)

	return fromBooleanE(checkPermission(fid, [])).fold(N, () => user)
}

export const useUserID = () => {
	const fid = useCurrentFID()
	const { id } = useStrictSubscription(user$, { id: null } as unknown as User.User)

	return fromBooleanE(checkPermission(fid, ["user.id"])).fold(N, () => id)
}

export const useUserEmail = () => {
	const fid = useCurrentFID()
	const { email } = useStrictSubscription(user$, { email: null } as unknown as User.User)

	return fromBooleanE(checkPermission(fid, ["user.email"])).fold(N, () => email)
}

export const useUserCreationDate = () => {
	const fid = useCurrentFID()
	const { createdAt } = useStrictSubscription(user$, { createdAt: null } as unknown as User.User)

	return fromBooleanE(checkPermission(fid, ["user.createdAt"])).fold(N, () => createdAt)
}

export const useUserSubscriptionStatus = () => {
	const fid = useCurrentFID()
	const { subscription } = useStrictSubscription(user$, {
		subscription: null,
	} as unknown as User.User)

	return fromBooleanE(checkPermission(fid, ["user.subscription"])).fold(N, () => subscription)
}

export const useUserName = () => {
	const fid = useCurrentFID()
	const user = useStrictSubscription(user$, {
		firstName: null,
		lastName: null,
	} as unknown as User.User)

	return fromBooleanE(checkPermission(fid, ["user.name"])).fold(N, () => ({
		firstName: user.firstName ?? "",
		lastName: user.lastName ?? "",
		fullName: Switch.of(user)
			.case(hasFirstNameAndLastName, user => `${user.firstName} ${user.lastName}`)
			.case(hasFirstName, user => user.firstName!)
			.case(hasLastName, user => user.lastName!)
			.default(() => ""),
	}))
}

export const useUserAchievements = () => {
	const fid = useCurrentFID()
	const achievements = useStrictSubscription(achievements$, [])

	return fromBooleanE(checkPermission(fid, ["user.achievements"])).fold(
		() => [] as Achievements.AchievementDAO[],
		() => achievements,
	)
}

// --- Internal ---

const hasFirstName = (user: User.User) => !!user.firstName
const hasLastName = (user: User.User) => !!user.lastName
const hasFirstNameAndLastName = (user: User.User) => hasFirstName(user) && hasLastName(user)
const checkPermission = (fid: symbol | null, queries: TQueryPermission[]) =>
	KnownFunctions.check_permissions(fid, { queries })
