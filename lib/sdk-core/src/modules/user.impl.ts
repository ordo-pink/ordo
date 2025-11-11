/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { impl as fns } from "./fns.impl"
import { impl as timestamp } from "./timestamp.impl"
import { impl as uuid } from "./uuid.impl"
import { impl as validations } from "./validations.impl"

export namespace impl {
	export const ref_rx = /^[a-z0-9_]{1,23}$/

	export const email_rx =
		// eslint-disable-next-line no-useless-escape
		/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

	// export const function_name_rx = /^@[a-z0-9_.-]+\/[a-z0-9_.-]+$/

	export const create_ref: Ordo.User.CreateRef = (id, email) => email.split("@")[0].concat(id.split("-")[0])

	export const create: Ordo.User.Create = (email, _ref, _name) => {
		const id = uuid.create()
		const ref = _ref ?? create_ref(id, email)
		const name = _name ?? ""
		const date = timestamp.create()

		return [id, ref, name, date, date, email]
	}

	export const to_other_user: Ordo.User.ToOtherUser = u => [u[0], u[1], u[2]]

	export const default_name: Ordo.User.DefaultName = () => ""

	export const ref_guard: Ordo.User.RefGuard = (x): x is Ordo.User.Ref => validations.is_string(x) && ref_rx.test(x)
	export const name_guard: Ordo.User.NameGuard = (x): x is Ordo.User.Name => validations.is_string(x) && fns.lt(256, x.length)
	export const email_guard: Ordo.User.EmailGuard = (x): x is Ordo.User.Email => validations.is_string(x) && email_rx.test(x)
	// export const installed_function_guard: Ordo.User.InstalledFunctionGuard = (x): x is Ordo.User.InstalledFunction =>
	//	result
	// 		.if_else(validations.is_string(x), { on_true: () => x as string })
	// 		.pipe(result.ops.map(x => x.split(":")))
	// 		.pipe(result.ops.chain(parts => result.if_else(parts.length === 2, { on_true: () => parts })))
	// 		.pipe(result.ops.map(([name, version]) => function_name_rx.test(name) && sem_ver.guard(version)))
	// 		.cata(result.catas.or_else(() => false))

	export const get_id: Ordo.User.GetId = fns.prop(0)
	export const get_ref: Ordo.User.GetRef = fns.prop(1)
	export const get_name: Ordo.User.GetName = fns.prop(2)
	export const get_created_at: Ordo.User.GetCreatedAt = fns.prop(3)
	export const get_updated_at: Ordo.User.GetUpdatedAt = fns.prop(4)
	export const get_email: Ordo.User.GetEmail = fns.prop(5)
	// export const get_installed_functions: Ordo.User.GetInstalledFunctions = fns.prop(7)

	export const has_the_name: Ordo.User.HasTheName = (x, dto) => fns.eq(get_name(dto), x)
	export const has_the_id: Ordo.User.HasTheId = (x, dto) => fns.eq(get_id(dto), x)
	export const has_the_ref: Ordo.User.HasTheRef = (x, dto) => fns.eq(get_ref(dto), x)
	export const has_the_email: Ordo.User.HasTheEmail = (email, dto) => fns.eq(get_email(dto), email)

	export const has_name: Ordo.User.HasName = fns.pipe(get_name).pipe(validations.is_non_empty_string)

	export const obfuscate_email: Ordo.User.ObfuscateEmail = email => {
		const [localPart, domainPart] = email.split("@")

		const topLevelDomainStartIndex = domainPart.lastIndexOf(".")

		const higherLevelDomain = domainPart.slice(0, topLevelDomainStartIndex)
		const topLevelDomain = domainPart.slice(topLevelDomainStartIndex)

		const localTrimSize = localPart.length > 5 ? 4 : localPart.length > 2 ? 2 : 0
		const domainTrimSize = higherLevelDomain.length > 5 ? 4 : higherLevelDomain.length > 2 ? 2 : 0

		return localPart
			.slice(0, localTrimSize / 2)
			.concat("*".repeat(localPart.length - localTrimSize))
			.concat(localTrimSize ? localPart.slice(-localTrimSize / 2) : "")
			.concat("@")
			.concat(higherLevelDomain.slice(0, domainTrimSize / 2))
			.concat("*".repeat(higherLevelDomain.length - domainTrimSize))
			.concat(domainTrimSize ? higherLevelDomain.slice(-domainTrimSize / 2) : "")
			.concat(topLevelDomain) as Ordo.User.Email
	}

	// export const has_installed_function: Ordo.User.HasInstalledFunction = (f, dto) => get_installed_functions(dto).includes(f)
	// export const has_installed_functions: Ordo.User.HasInstalledFunctions = fns
	// 	.pipe(get_installed_functions)
	// 	.pipe(fns.prop("length"))
	// 	.pipe(fns.gt(0))
}

declare global {
	namespace Ordo.User {
		export type Id = Uuid.Instance & {}
		export type Ref = string & {}
		export type Name = string & {}
		export type IsDev = 0 | 1
		export type CreatedAt = Timestamp.Instance & {}
		export type UpdatedAt = Timestamp.Instance & {}
		export type Email = `${string}@${string}.${string}` & {}
		// export type InstalledFunctionName = `@${string}/${string}` & {}
		// export type InstalledFunction = `${InstalledFunctionName}:${SemVer.Instance}` & {}
		// export type InstalledFunctions = InstalledFunction[]

		export type OtherUserInstance = [id: Id, ref: Ref, name: Name]
		export type Instance = [...OtherUserInstance, created_at: CreatedAt, updated_at: UpdatedAt, email: Email]

		export type Create = (email: Ordo.User.Email, ref?: Ordo.User.Ref, name?: Ordo.User.Name) => Instance

		export type CreateRef = (id: Id, email: Email) => Ref

		export type Serialize = (user: Instance) => Instance
		export type ToOtherUser = (user: Instance | OtherUserInstance) => OtherUserInstance

		export type DefaultName = () => Name
		// export type DefaultInstalledFunctions = () => InstalledFunctions

		export type RefGuard = GenericGuard<Ref>
		export type NameGuard = GenericGuard<Name>
		export type EmailGuard = GenericGuard<Email>
		// export type InstalledFunctionGuard = GenericGuard<InstalledFunction>

		export type GetRef = (user: OtherUserInstance | Instance) => Ref
		export type GetName = (user: OtherUserInstance | Instance) => Name
		export type GetId = (user: OtherUserInstance | Instance) => Id
		export type GetCreatedAt = (user: Instance) => CreatedAt
		export type GetUpdatedAt = (user: Instance) => UpdatedAt
		export type GetEmail = (user: Instance) => Email
		// export type GetInstalledFunctions = (user: Instance) => InstalledFunctions
		// export type GetSessions = (user: Instance) => Sessions

		export type HasTheName = (name: Name, user: OtherUserInstance | Instance) => boolean
		export type HasTheId = (id: Id, user: OtherUserInstance | Instance) => boolean
		export type HasTheRef = (ref: Ref, user: OtherUserInstance | Instance) => boolean
		export type HasTheEmail = (email: Email, user: Instance) => boolean

		export type IsPaid = (user: OtherUserInstance | Instance) => boolean
		export type IsFree = (user: OtherUserInstance | Instance) => boolean
		export type HasName = (user: OtherUserInstance | Instance) => boolean
		export type HasSessions = (user: Instance) => boolean
		// export type HasInstalledFunction = (f: InstalledFunction, user: Instance) => boolean
		// export type HasInstalledFunctions = (user: Instance) => boolean

		export type ObfuscateEmail = (email: Ordo.User.Email) => Ordo.User.Email
	}

	namespace Ordo.User.Server {
		export type ReadQuery = Partial<{
			[_Key in "email" | "ref" | "id" | "limit"]: _Key extends "email"
				? Ordo.User.Email
				: _Key extends "ref"
					? Ordo.User.Ref
					: _Key extends "id"
						? Ordo.User.Id
						: _Key extends "limit"
							? number
							: never
		}>

		export type Repository = {
			create: (user: Ordo.User.Instance) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"EIO" | "EEXIST">>
			read: (query?: ReadQuery) => Oath.Instance<Ordo.User.Instance[], Ordo.Rrr.Instance<"EIO">>
			update: Ordo.Fns.Curried<
				(id: Ordo.User.Id, user: Ordo.User.Instance) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			>
			delete: (id: Ordo.User.Id) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			kill: () => void
		}
	}
}
