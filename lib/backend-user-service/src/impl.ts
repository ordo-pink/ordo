// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { compare, genSalt, hash } from "#x/bcrypt@v0.4.1/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import * as T from "./types.ts"

export type UserServiceOptions = {
	saltRounds: number
}

export class UserService {
	#driver: T.UserRepository
	#salt: string

	public static async of(driver: T.UserRepository, options: UserServiceOptions) {
		const salt = await genSalt(options.saltRounds)

		return new UserService(driver, salt)
	}

	protected constructor(driver: T.UserRepository, salt: string) {
		this.#driver = driver
		this.#salt = salt
	}

	public createUser(email: string, password: string) {
		return Oath.from(() => hash(password, this.#salt))
			.chain(password =>
				this.#driver.create({
					id: crypto.randomUUID(),
					email,
					password,
					emailConfirmed: false,
					createdAt: new Date(Date.now()),
				})
			)
			.map(this.serialize)
	}

	public updateUserPassword(user: T.User, oldPassword: string, newPassword: string) {
		return this.#driver.getById(user.id).chain(oldUser =>
			Oath.from(() => compare(oldPassword, oldUser.password))
				.chain(valid =>
					Oath.fromBoolean(
						() => valid,
						() => user,
						() => "Invalid password"
					)
				)
				.chain(user =>
					Oath.from(() => hash(newPassword, this.#salt)).map(
						password =>
							({
								...user,
								password,
							} as T.InternalUser)
					)
				)
				.chain(user => this.#driver.update(oldUser.id, user).rejectedMap(() => "User not found"))
				.map(user => this.serialize(user))
		)
	}

	public update(id: string, user: Partial<T.User>) {
		return this.#driver.update(id, user).map(user => this.serialize(user))
	}

	public getByEmail(email: string) {
		return this.#driver.getByEmail(email).map(user => this.serialize(user))
	}

	public getUserInfo(email: string) {
		return this.#driver.getByEmail(email).map(user => this.serializePublic(user))
	}

	public getById(id: string) {
		return this.#driver.getById(id).map(user => this.serialize(user))
	}

	public comparePassword(email: string, password: string) {
		return this.#driver
			.getByEmail(email)
			.chain(user => Oath.from(() => compare(password, user.password)))
			.chain(x =>
				Oath.fromBoolean(
					() => x,
					() => x,
					() => x
				)
			)
	}

	private serialize(user: T.InternalUser): T.User {
		return {
			createdAt: user.createdAt,
			email: user.email,
			emailConfirmed: user.emailConfirmed,
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
		}
	}

	private serializePublic(user: T.InternalUser): T.PublicUser {
		return {
			createdAt: user.createdAt,
			email: user.email, // TODO: obfuscate email
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
		}
	}
}
