// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { test, expect } from "bun:test"
import { FSUserRepository } from "./backend-fs-user-repository.impl"
import { rmdir0 } from "@ordo-pink/fs"
import { User } from "@ordo-pink/frontend-core"

const path = "./var/test/backend-fs-user-repository/users.json"
const repository = FSUserRepository.of(path)

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
	await repository.create(user).toPromise()
	const persistedUserById = await repository.getById(id).toPromise()
	const doesNotExist = await repository.getById("123-123-123-123-123").orElse(() => null)

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
	await repository.create(user).toPromise()
	const persistedUserById = await repository.getByEmail(email).toPromise()
	const doesNotExist = await repository.getByEmail("wrong@test.com").orElse(() => null)

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
	await repository.create(user).toPromise()
	const persistedUserById = await repository.existsById(id).toPromise()
	const doesNotExist = await repository.existsById("123-123-123-123-123").toPromise()

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
	await repository.create(user).toPromise()
	const persistedUserById = await repository.existsByEmail(email).toPromise()
	const doesNotExist = await repository.existsByEmail("wrong@test.com").toPromise()

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
	await repository.create(user).toPromise()

	await repository.update(user.id, { ...user, email: newEmail }).toPromise()
	const updatedUser = await repository.getByEmail(newEmail).toPromise()

	expect(updatedUser.id).toEqual(id)

	await rmdir0(path).toPromise()
})
