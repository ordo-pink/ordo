// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getCommands } from "$streams/commands"

export const createOrdoFunction = (callback: (commands: ReturnType<typeof getCommands>) => any) =>
	callback(getCommands())
