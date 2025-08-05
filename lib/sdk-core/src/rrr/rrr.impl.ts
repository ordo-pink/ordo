/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { sweech } from "@ordo-pink/oss-sweech"

import * as RRR from "./rrr.constants"
import * as Rrr from "./rrr.types"

const create: Rrr.CreateType = type => (message, debug) => ({ type: RRR.TYPE[type], message, debug })

export const eacces = create("EACCES")
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

export const to_readable_type: Rrr.ToReadableType = type => RRR.TYPE[type] as Rrr.Type

export const to_status_code: Rrr.ToStatusCode = type =>
	sweech
		.match(type)
		.case(RRR.TYPE.EAGAIN, () => 425)
		.case(RRR.TYPE.ENXIO, () => 408)
		.case(RRR.TYPE.ENOSPC, () => 402)
		.case(RRR.TYPE.EFBIG, () => 413)
		.case(RRR.TYPE.EINVAL, () => 400)
		.case(RRR.TYPE.EACCES, () => 401)
		.case(RRR.TYPE.EPERM, () => 403)
		.case(RRR.TYPE.ENOENT, () => 404)
		.case(RRR.TYPE.EEXIST, () => 409)
		.default(() => 500)
