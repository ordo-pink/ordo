/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TCreateIDFn, TMaokaComponent, TMaokaElement } from "@ordo-pink/maoka"

export type TMaokaDOMElement = TMaokaElement & {
	onunmount?: () => void
	onmount?: (() => () => void) | (() => void)
}

export type TMaokaRenderDOMFn = (root: HTMLElement, component: TMaokaComponent, create_id: TCreateIDFn) => Promise<void>
