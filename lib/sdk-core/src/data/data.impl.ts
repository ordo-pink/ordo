/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as DATA from "./data.constants"
import * as Data from "./data.types"
import * as fns from "../fns/fns.impl"
import * as uuid from "../uuid/uuid.impl"

export const name_guard: Data.NameGuard = (x): x is Data.Name => fns.is_string(x)
export const parent_guard: Data.ParentGuard = (x): x is Data.Parent => uuid.guard(x) || fns.is_null(x)

export const default_label_color = () => DATA.LABEL_COLOR.DEFAULT

export const create_label: Data.CreateLabel = (t, c = default_label_color()) => [t, c]
