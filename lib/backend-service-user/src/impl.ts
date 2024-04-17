// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import crypto from "crypto"

import { Oath } from "@ordo-pink/oath"

import type { UserPersistenceStrategy } from "./types"

export class UserService {
	#persistenceStrategy: UserPersistenceStrategy

	public static of(driver: UserPersistenceStrategy) {
		return new UserService(driver)
	}

	protected constructor(driver: UserPersistenceStrategy) {
		this.#persistenceStrategy = driver
	}

	public createUser(email: string, password: string) {
		return Oath.from(() => Bun.password.hash(password))
			.chain(password =>
				this.#persistenceStrategy.create({
					id: crypto.randomUUID(),
					email,
					password,
					emailConfirmed: false,
					createdAt: new Date(Date.now()),
					fileLimit: 1000,
					maxUploadSize: 1.5,
					subscription: "free",
				}),
			)
			.map(this.serializePrivate)
	}

	public updateUserPassword(user: User.User, oldPassword: string, newPassword: string) {
		return this.#persistenceStrategy.getById(user.id).chain(oldUser =>
			Oath.from(() => Bun.password.verify(oldPassword, oldUser.password))
				.chain(valid =>
					Oath.fromBoolean(
						() => valid,
						() => user,
						() => "Invalid password",
					),
				)
				.chain(user =>
					Oath.from(() => Bun.password.hash(newPassword)).map(
						password =>
							({
								...user,
								password,
							}) as User.InternalUser,
					),
				)
				.chain(user =>
					this.#persistenceStrategy.update(oldUser.id, user).rejectedMap(() => "User not found"),
				)
				.map(user => this.serializePrivate(user)),
		)
	}

	public update(id: string, user: Partial<User.PrivateUser>) {
		return this.#persistenceStrategy.update(id, user).map(user => this.serializePrivate(user))
	}

	public getByEmail(email: string) {
		return this.#persistenceStrategy.getByEmail(email).map(user => this.serializePrivate(user))
	}

	public getUserInfo(email: string) {
		return this.#persistenceStrategy.getByEmail(email).map(user => this.serializePublic(user))
	}

	public getById(id: string) {
		return this.#persistenceStrategy.getById(id).map(user => this.serializePrivate(user))
	}

	public comparePassword(email: string, password: string) {
		return this.#persistenceStrategy
			.getByEmail(email)
			.chain(user => Oath.from(() => Bun.password.verify(password, user.password)))
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
		}
	}

	public serializePrivate(user: User.InternalUser): User.PrivateUser {
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
