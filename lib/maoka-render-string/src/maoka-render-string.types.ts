/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TMaokaComponent, TMaokaElement } from "@ordo-pink/maoka"

export type TMaokaRenderStringFn = (root: TMaokaStrElement, component: TMaokaComponent) => Promise<string>
export type TMaokaStrElement = TMaokaElement & { str: (depth?: number) => Promise<string> }
