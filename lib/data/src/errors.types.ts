// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Errors } from "./errors.impl"

export type DataErrorName = keyof typeof Errors
export type DataError = (typeof Errors)[DataErrorName]
