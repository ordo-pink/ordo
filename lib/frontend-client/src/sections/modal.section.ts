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

import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { Maoka } from "@ordo-pink/maoka"
import { type TLogger } from "@ordo-pink/logger"

import { ModalOverlay } from "../components/modal"
import { TCreateFunctionContext } from "@ordo-pink/core"

type P = { commands: Client.Commands.Commands; logger: TLogger; ctx: TCreateFunctionContext }
export const init_modal = ({ commands, logger, ctx }: P) => {
	logger.debug("🟡 Initialising modal...")

	commands.on("cmd.application.modal.show", on_modal_show)
	commands.on("cmd.application.modal.hide", on_modal_hide)

	const root = document.getElementById("modal") as HTMLDivElement

	Maoka.render_dom(root, ModalOverlay(modal$, ctx))

	logger.debug("🟢 Initialised modal.")
}

// --- Internal ---

// Define Observable to maintain modal state
const modal$ = new BehaviorSubject<TOption<Client.Modal.ModalPayload>>(O.None())

// Define command handlers
const on_modal_show: Client.Commands.TCommandHandler<Client.Modal.ModalPayload> = payload => {
	const show_close_button = payload.show_close_button ?? true
	const on_unmount = payload.on_unmount ?? (() => void 0)
	const render = payload.render

	modal$.next(O.Some({ render, show_close_button, on_unmount }))
}

const on_modal_hide = () => modal$.next(O.None())

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

/*
import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { extend } from "@ordo-pink/tau"
import { init_ordo_hooks } from "@ordo-pink/maoka-ordo-hooks"
import { render_dom } from "@ordo-pink/maoka"

import { ModalOverlay } from "../components/modal"
import { init_modal_hook } from "../hooks/use-modal.hook"

type P = { commands: Client.Commands.Commands; logger: TLogger; ctx: TCreateFunctionContext }
export const init_modal = ({ commands, logger, ctx }: P) => {
	logger.debug("🟡 Initialising modal...")

	commands.on("cmd.application.modal.show", on_modal_show)
	commands.on("cmd.application.modal.hide", on_modal_hide)

	const init_hooks = () => ({ ...init_ordo_hooks(ctx), ...init_modal_hook(modal$) })

	O.FromNullable(document.querySelector("#modal"))
		.pipe(O.ops.chain(root => (root instanceof HTMLDivElement ? O.Some(root) : O.None())))
		.pipe(O.ops.map(root => ({ root, component: ModalOverlay })))
		.pipe(O.ops.map(extend(() => ({ hooks: init_hooks() }))))
		.pipe(O.ops.map(({ root, component, hooks }) => render_dom(root, component, hooks)))
		.cata(O.catas.or_else(log_div_not_found(logger)))

	logger.debug("🟢 Initialised modal.")
}

// --- Internal ---

const log_div_not_found = (logger: TLogger) => () => logger.error("#modal div not found.")

/**
 * ModalState definition
 * TODO: Move to core
 */
// type ModalState = {
// 	show_close_button?: boolean
// 	on_unmount?: () => void
// 	render: (div: HTMLDivElement) => void
// }

// // Define Observable to maintain modal state
// const modal$ = new BehaviorSubject<TOption<ModalState>>(O.None())

// // Define command handlers
// const on_modal_show: Client.Commands.TCommandHandler<Client.Modal.ModalPayload> = payload => {
// 	const show_close_button = payload.show_close_button ?? true
// 	const on_unmount = payload.on_unmount ?? (() => void 0)
// 	const render = payload.render

// 	modal$.next(O.Some({ render, show_close_button, on_unmount }))
// }

// const on_modal_hide = () => modal$.next(O.None())
