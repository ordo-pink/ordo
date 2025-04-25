/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { LOCALE_READABLE_NAME, TWO_LETTER_LOCALE } from "@ordo-pink/locale"
import { keys_of } from "@ordo-pink/tau"

import { RoutaryOrdo } from "../../routary-ordo.types"

const locales = keys_of(LOCALE_READABLE_NAME).filter(locale => locale !== TWO_LETTER_LOCALE.ENGLISH)

export const assign_request_language: RoutaryOrdo.AssignRequestLanguage = intake => {
	const accept_language = intake.req.headers.get("Accept-Language")

	intake.request_language = TWO_LETTER_LOCALE.ENGLISH

	if (!accept_language) return

	for (const locale of locales) {
		if (!accept_language.includes(locale)) continue
		intake.request_language = locale as TWO_LETTER_LOCALE
	}
}
