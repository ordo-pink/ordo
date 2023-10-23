// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ContentPersistenceStrategy } from "@ordo-pink/data"
import { Oath } from "@ordo-pink/oath"

const of = (): ContentPersistenceStrategy<any> => ({
	create: () => Oath.of("OK"),
	delete: () => Oath.of("OK"),
	read: () => Oath.empty(),
	write: () => Oath.of(0),
})

export const ClientContentRepository = { of }
