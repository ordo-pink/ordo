/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/maoka"

export const is_darwin_jab: Maoka.Jab<boolean> = () => navigator.appVersion.indexOf("Mac") !== -1
