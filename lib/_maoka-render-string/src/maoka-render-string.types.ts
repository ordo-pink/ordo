/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TCreateIDFn, TMaokaComponent, TMaokaElement } from "@ordo-pink/oss-maoka"

export type TMaokaRenderStringFn = (component: TMaokaComponent, create_id: TCreateIDFn) => Promise<string>
export type TMaokaStringElement = TMaokaElement & { str: () => Promise<string> }
