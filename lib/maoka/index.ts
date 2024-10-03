// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export * from "./src/maoka.types"

import { create, lazy, pure, render_dom } from "./src/maoka.impl"

export const Maoka = { create, lazy, pure, render_dom }
