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

import { type Observable } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { extend } from "@ordo-pink/tau"
import { init_ordo_hooks } from "@ordo-pink/maoka-ordo-hooks"
import { render_dom } from "@ordo-pink/maoka"

import { ActivityBar } from "../components/activity-bar/activity-bar.component"
import { init_activities_hook } from "../hooks/use-activities.hook"

type P = {
	logger: TLogger
	activities$: Observable<Functions.Activity[]>
	current_activity$: Observable<TOption<Functions.Activity>>
	ctx: TCreateFunctionContext
}
export const init_activity_bar = ({ logger, activities$, current_activity$, ctx }: P) => {
	logger.debug("🟡 Initialising activity bar...")

	O.FromNullable(document.querySelector("#activity-bar"))
		.pipe(O.ops.chain(root => (root instanceof HTMLDivElement ? O.Some(root) : O.None())))
		.pipe(O.ops.map(root => ({ root, component: ActivityBar })))
		.pipe(O.ops.map(extend(() => ({ hooks: init_hooks(activities$, current_activity$, ctx) }))))
		.pipe(O.ops.map(render_dom))
		.cata(O.catas.or_else(() => logger.error("#activity-bar div not found.")))

	logger.debug("🟢 Initialised activity bar.")
}

const init_hooks = (
	activities$: Observable<Functions.Activity[]>,
	current_activity$: Observable<TOption<Functions.Activity>>,
	ctx: TCreateFunctionContext,
) => ({
	...init_ordo_hooks(ctx),
	...init_activities_hook({ activities$, current_activity$ }),
})
