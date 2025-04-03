/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { afterEach, describe, expect, test } from "bun:test"

import { CurrentUser, CurrentUserKeys, rrr } from "@ordo-pink/core"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"

import { USER_FILE_FSID, create_persistence_strategy_user } from "./backend-persistence-strategy-user.impl"

let data = {} as Record<string, ReadableStream | undefined>

const persistence_strategy_data: OrdoBackend.Data.PersistenceStrategy = {
	create: (uid, fsid, input) =>
		Oath.Resolve(`${uid}/${fsid}`)
			.pipe(ops0.map(key => void (data[key] = input)))
			.pipe(ops0.map(() => 0)),

	delete: (uid, fsid) => Oath.Resolve(`${uid}/${fsid}`).pipe(ops0.map(key => void (data[key] = undefined))),

	exists: (uid, fsid) => Oath.Resolve(`${uid}/${fsid}`).pipe(ops0.map(key => !!data[key])),

	read: (uid, fsid) => Oath.Resolve(`${uid}/${fsid}`).pipe(ops0.map(key => data[key]!)),

	mtime: () => Oath.Resolve(0),

	update: (uid, fsid, input) =>
		Oath.Resolve(`${uid}/${fsid}`)
			.pipe(ops0.map(key => void (data[key] = input)))
			.pipe(ops0.map(() => 0)),
}

const user_storage = create_persistence_strategy_user(persistence_strategy_data)

const test_user = CurrentUser.Create("test@test.com", 1, 1, 1)

describe("persistence_strategy_user", () => {
	afterEach(() => {
		data = {}
	})

	test("should pass", () => {
		expect(create_persistence_strategy_user).toBeTypeOf("function")
	})

	test("should throw error if persistence_strategy_data is not PersistenceStrategyData", () => {
		const broken_user_storage = create_persistence_strategy_user({} as any)
		expect(() => broken_user_storage.exists(crypto.randomUUID()).invoke(invokers0.to_promise)).toThrow()
	})

	describe("create", () => {
		test("should properly create a user", async () => {
			await user_storage.create(test_user).invoke(invokers0.to_promise)
			expect(data[`${test_user.get_uid()}/${USER_FILE_FSID}`]).toBeInstanceOf(ReadableStream)
		})

		test("should not create user if it already exists", async () => {
			await user_storage.create(test_user).invoke(invokers0.to_promise)
			expect(() => user_storage.create(test_user).invoke(invokers0.to_promise)).toThrow("User already exists")
		})

		test("should reject with EIO if persistence_strategy_data fails", () => {
			const broken_user_storage = create_persistence_strategy_user({ exists: () => Oath.Reject(rrr.codes.eio("asdf")) } as any)
			expect(() => broken_user_storage.create(test_user).invoke(invokers0.to_promise)).toThrow("asdf")
		})
	})

	describe("read", () => {
		test("should properly read a user", async () => {
			await user_storage.create(test_user).invoke(invokers0.to_promise)
			const user = await user_storage.read(test_user.get_uid()).invoke(invokers0.to_promise)

			expect(user.to_dto()).toEqual(test_user.to_dto())
		})

		test("should not read user if it does not exist", () => {
			expect(() => user_storage.read(test_user.get_uid()).invoke(invokers0.to_promise)).toThrow("User not found")
		})

		test("should reject with EIO if persistence_strategy_data fails", () => {
			const broken_user_storage = create_persistence_strategy_user({ exists: () => Oath.Reject(rrr.codes.eio("asdf")) } as any)
			expect(() => broken_user_storage.read(test_user.get_uid()).invoke(invokers0.to_promise)).toThrow("asdf")
		})
	})

	describe("update", () => {
		test("should properly update a user", async () => {
			await user_storage.create(test_user).invoke(invokers0.to_promise)
			const dto = test_user.to_dto()
			const new_email = "test1@email.com"
			dto[CurrentUserKeys.EMAIL] = new_email
			await user_storage.update(test_user.get_uid(), CurrentUser.FromDTO(dto)).invoke(invokers0.to_promise)
			const updated_user = await user_storage.read(test_user.get_uid()).invoke(invokers0.to_promise)
			expect(updated_user.get_email()).toEqual(new_email)
		})

		test("should not update user if it does not exist", () => {
			expect(() => user_storage.update(crypto.randomUUID(), test_user).invoke(invokers0.to_promise)).toThrow("User not found")
		})

		test("should reject with EIO if persistence_strategy_data fails", () => {
			const broken_user_storage = create_persistence_strategy_user({ exists: () => Oath.Reject(rrr.codes.eio("asdf")) } as any)
			expect(() => broken_user_storage.update(test_user.get_uid(), test_user).invoke(invokers0.to_promise)).toThrow("asdf")
		})
	})

	describe("delete", () => {
		test("should not be implemented", () => {
			const broken_user_storage = create_persistence_strategy_user({ exists: () => Oath.Reject(rrr.codes.eio("asdf")) } as any)
			expect(() => broken_user_storage.delete(crypto.randomUUID()).invoke(invokers0.to_promise)).toThrow("Not implemented")
		})
	})

	describe("exists", () => {
		test("should resolve with false if user does not exist", async () => {
			expect(await user_storage.exists(crypto.randomUUID()).invoke(invokers0.to_promise)).toBeFalse()
		})

		test("should resolve with true if user exists", async () => {
			const user = CurrentUser.Create("test@test.com", 1, 1, 1)
			await user_storage.create(user).invoke(invokers0.to_promise)
			expect(await user_storage.exists(user.get_uid()).invoke(invokers0.to_promise)).toBeTrue()
		})

		test("should reject with EIO if persistence_strategy_data fails", () => {
			const broken_user_storage = create_persistence_strategy_user({ exists: () => Oath.Reject(rrr.codes.eio("asdf")) } as any)
			expect(() => broken_user_storage.exists(crypto.randomUUID()).invoke(invokers0.to_promise)).toThrow("Could not check user")
		})
	})
})
