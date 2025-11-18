/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { create_i18n } from "./i18n.impl"
import { LOCALE } from "./i18n.constants"

test.describe("i18n", () => {
	test.it("should create an instance", () => {
		const i18n = create_i18n(LOCALE.ENGLISH, { en_hello_world: "Hello World!" })
		test.expect(i18n.translate("hello_world")).toBe("Hello World!")
	})

	test.it("should add translations", () => {
		const i18n = create_i18n(LOCALE.ENGLISH)
		test.expect(i18n.translate("hello_world", "oops")).toBe("oops")

		i18n.add(LOCALE.ENGLISH, { hello_world: "Hello World!" })
		test.expect(i18n.translate("hello_world", "oops")).toBe("Hello World!")
	})

	test.it("should switch locale", () => {
		const i18n = create_i18n(LOCALE.ENGLISH)
		i18n.add(LOCALE.ENGLISH, { hello_world: "Hello World!" })
		i18n.add(LOCALE.KOREAN, { hello_world: "안녕하세요!" })
		i18n.set_locale(LOCALE.KOREAN)
		test.expect(i18n.translate("hello_world", "oops")).toBe("안녕하세요!")
	})
})
