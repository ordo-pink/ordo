/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Oath } from "../../oath.types"
import { create } from "./create.impl"

export const resolve: Oath.Constructors.Resolve = x => create(res => res(x))

export const reject: Oath.Constructors.Reject = x => create((_, rej) => rej(x))

export const empty: Oath.Constructors.Empty = () => create(res => res(void 0))
