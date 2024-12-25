/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { Maoka } from "@ordo-pink/maoka"
import { type TLogger } from "@ordo-pink/logger"

import { ModalOverlay } from "../components/modal"

type P = { commands: Ordo.Command.Commands; logger: TLogger; ctx: Ordo.CreateFunction.Params }
export const init_modal = ({ commands, logger, ctx }: P) => {
	logger.debug("🟡 Initialising modal...")

	commands.on("cmd.application.modal.show", on_modal_show)
	commands.on("cmd.application.modal.hide", on_modal_hide)

	const root = document.getElementById("modal") as HTMLDivElement

	void Maoka.render_dom(root, ModalOverlay($, ctx))

	logger.debug("🟢 Initialised modal.")
}

// --- Internal ---

// Define Observable to maintain modal state
const $ = new BehaviorSubject<TOption<Ordo.Modal.Instance>>(O.None())

// Define command handlers
const on_modal_show: Ordo.Command.CommandHandler<Ordo.Modal.Instance> = payload => {
	const show_close_button = payload.show_close_button ?? true
	const on_unmount = payload.on_unmount ?? (() => void 0)
	const render = payload.render

	$.next(O.Some({ render, show_close_button, on_unmount }))
}

const on_modal_hide = () => {
	$.getValue().unwrap()?.on_unmount?.()
	$.next(O.None())
}
