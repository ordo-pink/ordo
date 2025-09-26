/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"

export * from "./components/button.component"

export const context: OrdoClientMaoka.Context = maoka.context.create()

export const with_context = (state: OrdoClient.F.State) => maoka.styled.div("", ({ use }) => void use(context.provide(state)))
