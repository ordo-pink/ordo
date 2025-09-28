/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"

export * as components from "./components"
export * as jabs from "./jabs"

export const context: OrdoClientMaoka.Context = maoka.context.create()

export const with_context = (state: OrdoClient.F.State) => maoka.styled.div("", ({ use }) => void use(context.provide(state)))
