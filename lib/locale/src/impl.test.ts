// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { TwoLetterLocale, TwoLetterLocaleReadableName, twoLetterLocaleToReadableName } from "./impl"

test("locale", () => {
	const locale = Object.values(TwoLetterLocale).filter(value => Number.isNaN(Number(value)))[0]

	expect(twoLetterLocaleToReadableName(locale)).toEqual(TwoLetterLocaleReadableName[locale])
})
