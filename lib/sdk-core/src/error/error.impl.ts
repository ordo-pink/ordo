/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { RRR } from "./error.constants"
import type { Rrr } from "./error.types"

export namespace rrr {
	const create: Rrr.CreateType =
		type =>
		(message, ...debug) => ({ type: RRR.TYPE[type], message, debug })

	export const eaccess = create("EACCES")
	export const eagain = create("EAGAIN")
	export const eexist = create("EEXIST")
	export const efbig = create("EFBIG")
	export const eintr = create("EINTR")
	export const einval = create("EINVAL")
	export const eio = create("EIO")
	export const enoent = create("ENOENT")
	export const enospc = create("ENOSPC")
	export const enxio = create("ENXIO")
	export const eperm = create("EPERM")
	export const eunknown = create("EUNKNOWN")
}
