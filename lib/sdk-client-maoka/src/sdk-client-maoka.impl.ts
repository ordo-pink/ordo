/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka_context } from "@ordo-pink/oss-maoka-context"

export * as components from "./components"
export * as jabs from "./jabs"

export const context: OrdoClientMaoka.Context = maoka_context.create()
