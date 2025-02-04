/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type * from "./src/maoka.types.ts"

import { create, dom, html, lazy, styled } from "./src/maoka.impl.ts"

export const Maoka = { create, html, lazy, styled, dom }
