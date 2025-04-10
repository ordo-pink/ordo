/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Oath } from "../../oath.types"
import { create } from "./create.impl"

export const from_promise: Oath.Constructors.FromPromise = f => create((resolve, reject) => f().then(resolve, reject))
