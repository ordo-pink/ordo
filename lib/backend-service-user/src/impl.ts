// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { UserPersistenceStrategy } from "./types"
import { hash, compare, genSalt } from "bcryptjs"
import crypto from "crypto"
import { Oath } from "@ordo-pink/oath"
import { UUIDv4 } from "@ordo-pink/tau"
import { User } from "@ordo-pink/frontend-core"

export type UserServiceOptions = {
	saltRounds: number
}

export class UserService {
	#persistenceStrategy: UserPersistenceStrategy
	#salt: string

	public static async of(driver: UserPersistenceStrategy, options: UserServiceOptions) {
		const salt = await genSalt(options.saltRounds)

		return new UserService(driver, salt)
	}

	protected constructor(driver: UserPersistenceStrategy, salt: string) {
		this.#persistenceStrategy = driver
		this.#salt = salt
	}

	public createUser(email: string, password: string) {
		return Oath.from(() => hash(password, this.#salt))
			.chain(password =>
				this.#persistenceStrategy.create({
					id: crypto.randomUUID() as UUIDv4,
					email,
					password,
					emailConfirmed: false,
					createdAt: new Date(Date.now()),
					fileLimit: 1000,
					maxUploadSize: 1.5,
					subscription: "free",
				}),
			)
			.map(this.serialize)
	}

	public updateUserPassword(user: User.User, oldPassword: string, newPassword: string) {
		return this.#persistenceStrategy.getById(user.id).chain(oldUser =>
			Oath.from(() => compare(oldPassword, oldUser.password))
				.chain(valid =>
					Oath.fromBoolean(
						() => valid,
						() => user,
						() => "Invalid password",
					),
				)
				.chain(user =>
					Oath.from(() => hash(newPassword, this.#salt)).map(
						password =>
							({
								...user,
								password,
							} as User.InternalUser),
					),
				)
				.chain(user =>
					this.#persistenceStrategy.update(oldUser.id, user).rejectedMap(() => "User not found"),
				)
				.map(user => this.serialize(user)),
		)
	}

	public update(id: string, user: Partial<User.User>) {
		return this.#persistenceStrategy.update(id, user).map(user => this.serialize(user))
	}

	public getByEmail(email: string) {
		return this.#persistenceStrategy.getByEmail(email).map(user => this.serialize(user))
	}

	public getUserInfo(email: string) {
		return this.#persistenceStrategy.getByEmail(email).map(user => this.serializePublic(user))
	}

	public getById(id: string) {
		return this.#persistenceStrategy.getById(id).map(user => this.serialize(user))
	}

	public comparePassword(email: string, password: string) {
		return this.#persistenceStrategy
			.getByEmail(email)
			.chain(user => Oath.from(() => compare(password, user.password)))
			.chain(x =>
				Oath.fromBoolean(
					() => x,
					() => x,
					() => x,
				),
			)
	}

	public serialize(user: User.InternalUser): User.User {
		return {
			createdAt: user.createdAt,
			email: user.email,
			emailConfirmed: user.emailConfirmed,
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			handle: user.handle,
			fileLimit: user.fileLimit,
			maxUploadSize: user.maxUploadSize,
			subscription: user.subscription,
			code: user.code,
		}
	}

	public serializePublic(user: User.InternalUser | User.PublicUser): User.PublicUser {
		return {
			createdAt: user.createdAt,
			email: this.obfuscateEmail(user.email),
			firstName: user.firstName,
			lastName: user.lastName,
			handle: user.handle,
			subscription: user.subscription,
		}
	}

	private obfuscateEmail(email: string): string {
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
			.concat(topLevelDomain)
	}
}
