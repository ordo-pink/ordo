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

import { expect, test } from "bun:test"
import { PersistenceStrategyUserFS } from "./backend-persistence-strategy-user-fs.impl"
import { rmdir0 } from "@ordo-pink/fs"

const path = "./var/test/backend-fs-user-repository/users.json"
const strategy = PersistenceStrategyUserFS.of(path)

test("should get user by id", async () => {
	const createdAt = new Date(Date.now())
	const email = "test@test.com"
	const id = "asdf-asdf-asdf-asdf-asdf"
	const password = "asfasdfsaf"
	const user = {
		createdAt,
		email,
		emailConfirmed: false,
		id,
		password,
		subscription: "free",
		fileLimit: 1000,
		maxUploadSize: 1.5,
	} satisfies User.InternalUser
	await strategy.create(user).toPromise()
	const persistedUserById = await strategy.getById(id).toPromise()
	const doesNotExist = await strategy.getById("123-123-123-123-123").orElse(() => null)

	expect(persistedUserById.email).toEqual(email)
	expect(doesNotExist).toBeNull()

	await rmdir0(path).toPromise()
})

test("should get user by email", async () => {
	const createdAt = new Date(Date.now())
	const email = "test@test.com"
	const id = "asdf-asdf-asdf-asdf-asdf"
	const password = "asfasdfsaf"
	const user = {
		createdAt,
		email,
		emailConfirmed: false,
		id,
		password,
		subscription: "free",
		fileLimit: 1000,
		maxUploadSize: 1.5,
	} satisfies User.InternalUser
	await strategy.create(user).toPromise()
	const persistedUserById = await strategy.getByEmail(email).toPromise()
	const doesNotExist = await strategy.getByEmail("wrong@test.com").orElse(() => null)

	expect(persistedUserById.id).toEqual(id)
	expect(doesNotExist).toBeNull()

	await rmdir0(path).toPromise()
})

test("should check user existence by id", async () => {
	const createdAt = new Date(Date.now())
	const email = "test@test.com"
	const id = "asdf-asdf-asdf-asdf-asdf"
	const password = "asfasdfsaf"
	const user = {
		createdAt,
		email,
		emailConfirmed: false,
		id,
		password,
		subscription: "free",
		fileLimit: 1000,
		maxUploadSize: 1.5,
	} satisfies User.InternalUser
	await strategy.create(user).toPromise()
	const persistedUserById = await strategy.existsById(id).toPromise()
	const doesNotExist = await strategy.existsById("123-123-123-123-123").toPromise()

	expect(persistedUserById).toBeTrue()
	expect(doesNotExist).toBeFalse()

	await rmdir0(path).toPromise()
})

test("should check user existence by email", async () => {
	const createdAt = new Date(Date.now())
	const email = "test@test.com"
	const id = "asdf-asdf-asdf-asdf-asdf"
	const password = "asfasdfsaf"
	const user = {
		createdAt,
		email,
		emailConfirmed: false,
		id,
		password,
		subscription: "free",
		fileLimit: 1000,
		maxUploadSize: 1.5,
	} satisfies User.InternalUser
	await strategy.create(user).toPromise()
	const persistedUserById = await strategy.existsByEmail(email).toPromise()
	const doesNotExist = await strategy.existsByEmail("wrong@test.com").toPromise()

	expect(persistedUserById).toBeTrue()
	expect(doesNotExist).toBeFalse()

	await rmdir0(path).toPromise()
})

test("should update user info", async () => {
	const createdAt = new Date(Date.now())
	const email = "test@test.com"
	const newEmail = "test1@test.com"
	const id = "asdf-asdf-asdf-asdf-asdf"
	const password = "asfasdfsaf"
	const user = {
		createdAt,
		email,
		emailConfirmed: false,
		id,
		password,
		subscription: "free",
		fileLimit: 1000,
		maxUploadSize: 1.5,
	} satisfies User.InternalUser
	await strategy.create(user).toPromise()

	await strategy.update(user.id, { ...user, email: newEmail }).toPromise()
	const updatedUser = await strategy.getByEmail(newEmail).toPromise()

	expect(updatedUser.id).toEqual(id)

	await rmdir0(path).toPromise()
})
