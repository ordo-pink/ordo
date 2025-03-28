/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { RoutaryOrdo } from "../../routary-ordo.types"

export const set_header: RoutaryOrdo.SetHeader = (key, value) => intake => void intake.headers.set(key, value)

export const set_header_c: RoutaryOrdo.SetHeaderCurry = key => value => set_header(key, value)
