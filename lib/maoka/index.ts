// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export type * from "./src/maoka.types"

import { create, html, lazy, render_dom, styled } from "./src/maoka.impl"

export const Maoka = { create, html, lazy, styled, render_dom }
