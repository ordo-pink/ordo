// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import * as hooks from "./src/maoka.hooks"
import { create, render_dom, styled } from "./src/maoka.impl"

export * from "./src/maoka.impl"
export * from "./src/maoka.types"
export * from "./src/maoka.hooks"

export const Maoka = { create, render_dom, styled, hooks }
