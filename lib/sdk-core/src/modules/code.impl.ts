/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { impl as fns } from "./fns.impl"
import { impl as timestamp } from "./timestamp.impl"
import { impl as validations } from "./validations.impl"

export namespace CONSTANTS {
	export namespace SERVER {
		export enum USAGE {
			AUTHENTICATION,
			EMAIL_CHANGE,
			length,
		}
	}
}

export namespace impl {
	export namespace server {
		export const auth_code_lifetime_seconds_guard: Ordo.Code.Server.AuthCodeLifetimeSecondsGuard =
			validations.is_positive_integer

		export const email_change_lifetime_seconds_guard: Ordo.Code.Server.EmailChangeCodeLifetimeSecondsGuard =
			validations.is_positive_integer

		export const usage_guard: Ordo.Code.Server.UsageGuard = (x): x is Ordo.Code.Server.Usage =>
			validations.is_positive_integer(x) && fns.lt(CONSTANTS.SERVER.USAGE.length, x)

		export const guard: Ordo.Code.Server.Guard = (x): x is Ordo.Code.Server.Instance =>
			validations.is_array(x) &&
			x.length === 3 &&
			timestamp.guard(x[0]) &&
			validations.is_non_empty_string(x[1]) &&
			usage_guard(x[2])

		export const create: Ordo.Code.Server.Create = fns.curry(
			(hash, usage) => [timestamp.create(), hash, usage] satisfies Ordo.Code.Server.Instance,
		)
	}
}

declare global {
	namespace Ordo.Code.Server {
		type AuthCodeLifetimeSeconds = number & {}
		type AuthCodeLifetimeSecondsGuard = (x: any) => x is AuthCodeLifetimeSeconds
		type EmailChangeCodeLifetimeSeconds = number & {}
		type EmailChangeCodeLifetimeSecondsGuard = (x: any) => x is EmailChangeCodeLifetimeSeconds

		type Code = string & {}
		type Hash = string & {}
		type IssuedAt = Ordo.Timestamp.Instance
		type Usage = CONSTANTS.SERVER.USAGE
		type UsageGuard = (x: any) => x is Usage

		type Guard = (x: any) => x is Instance

		type Instance = [issued_at: IssuedAt, hash: Hash, usage: Usage]

		type Create = Ordo.Fns.Curried<(hash: Hash, usage: Usage) => Instance>

		type Repository = {
			read: (email: Ordo.User.Email) => Oath.Instance<Instance[], Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			update: Ordo.Fns.Curried<
				(email: Ordo.User.Email, values: Instance[]) => Oath.Instance<Instance[], Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			>
			delete: (email: Ordo.User.Email) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			kill: () => void
		}

		type HashingStrategy = {
			hash: (code: Code) => Oath.Instance<Hash, Ordo.Rrr.Instance<"EIO">>
			verify: Ordo.Fns.Curried<(code: Code, hash: Hash) => Oath.Instance<boolean, Ordo.Rrr.Instance<"EIO">>>
		}
	}
}
