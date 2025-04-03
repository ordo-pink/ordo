/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, mock, test } from "bun:test"

import { Oath } from "./oath.impl"
import { invokers0 } from "./invokers"
import { ops0 } from "./operators/mod"

describe("Oath", () => {
	describe("constructors", () => {
		test("Oath.resolve should create a resolved oath of provided value", async () => {
			const resolved = Oath.Resolve(1).invoke(invokers0.or_nothing)

			expect(await resolved).toEqual(1)
		})

		test("Oath.resolve should create a resolved oath of provided value", async () => {
			const resolved = Oath.Resolve(1).invoke(invokers0.or_nothing)

			expect(await resolved).toEqual(1)
		})

		test("empty0 should create a resolved oath of undefined", async () => {
			const resolved = Oath.Empty().invoke(invokers0.or_nothing)

			expect(await resolved).toBeUndefined()
		})

		test("Oath.reject should create a rejected oath of provided value", async () => {
			const resolved = Oath.Reject(1).fork(
				x => x,
				x => x,
			)

			expect(await resolved).toEqual(1)
		})

		test("fromNullable0 should create a rejected oath of null if provided value is nullish (null or undefined)", async () => {
			const rejected = Oath.FromNullable(null).fork(
				x => x,
				x => x,
			)

			expect(await rejected).toBeNull()
		})

		test("fromNullable0 should create a resolved oath of provided value if the value is not nullish (null or undefined", async () => {
			const resolved = Oath.FromNullable(0).fork(
				x => x,
				x => x,
			)

			expect(await resolved).toEqual(0)
		})

		test("try0 should create a resolved oath of value returned by the provided callback if it does not throw", async () => {
			const resolved = Oath.Try(() => 1).fork(
				x => x,
				x => x,
			)

			expect(await resolved).toEqual(1)
		})

		test("try0 should created a rejected oath of error thrown by the provided callback", async () => {
			const rejected = Oath.Try(() => {
				throw new Error("Oops")
			}).fork(
				x => x,
				x => x,
			)

			expect(await rejected).toBeInstanceOf(Error)
		})

		test("fromPromise0 should create a resolved oath from provided resolved promise thunk", async () => {
			const resolved = Oath.FromPromise(() => Promise.resolve(1)).fork(
				x => x,
				x => x,
			)

			expect(await resolved).toEqual(1)
		})

		test("fromPromise0 should create a rejected oath from provided rejected promise thunk", async () => {
			const resolved = Oath.FromPromise(() => Promise.reject(1)).fork(
				x => x,
				(x: any) => x + 1,
			)

			expect(await resolved).toEqual(1)
		})

		test("merge0 should create a resolved oath of array of resolved provided values", async () => {
			const resolved = await Oath.Merge([0, Promise.resolve(1), Oath.Resolve(2)]).fork(
				x => x,
				x => x,
			)

			expect(resolved[0]).toEqual(0)
			expect(resolved[1]).toEqual(1)
			expect(resolved[2]).toEqual(2)
		})

		test("merge0 should create a rejected oath of the first rejected value if at least one of the provided values rejects on resolution", async () => {
			const resolved = await Oath.Merge([0, Promise.reject("fails"), Oath.Resolve(2)]).fork(
				x => x,
				x => x,
			)

			expect(resolved).toEqual("fails" as any)
		})

		test("merge0 should create a resolved oath of record of resolved provided values", async () => {
			const resolved = await Oath.Merge({ a: 0, b: Promise.resolve(1), c: Oath.Resolve(2) }).fork(
				x => x,
				x => x,
			)

			expect(resolved.a).toEqual(0)
			expect(resolved.b).toEqual(1)
			expect(resolved.c).toEqual(2)
		})

		test("merge0 should create a rejected oath of the first rejected value if at least one of the provided values rejects on resolution", async () => {
			const resolved = await Oath.Merge({ a: 0, b: Promise.reject("fails"), c: Oath.Resolve(2) }).fork(
				x => x,
				x => x,
			)

			expect(resolved).toEqual("fails" as any)
		})
	})

	describe("methods", () => {
		test("resolved oath should fork to resolved promise with oath.fork", async () => {
			const resolved = Oath.Resolve(1).fork(
				x => x,
				x => x,
			)

			expect(await resolved).toEqual(1)
		})

		test("rejected oath should fork to resolved promise with oath.fork", async () => {
			const rejected = Oath.Reject(1).fork(
				x => x,
				x => x,
			)

			expect(await rejected).toEqual(1)
		})

		test("pipe should apply provided function over given Oath", async () => {
			const addOne0 = ops0.map((x: number) => x + 1)
			const resolved = Oath.Resolve(1).pipe(addOne0).pipe(addOne0).pipe(addOne0).invoke(invokers0.to_promise)

			expect(await resolved).toEqual(4)
		})

		test("resolved oath.and should return a resolved oath of a value updated by the callback if the callback is neither oath nor promise", async () => {
			const resolved = Oath.Resolve(1)
				.and(x => x + 1)
				.invoke(invokers0.or_nothing)

			expect(await resolved).toEqual(2)
		})

		test("resolved oath.and should return a resolved oath of a value updated by the value of the callback returning a resolved oath", async () => {
			const resolved = Oath.Resolve(1)
				.and(x => Oath.Resolve(x + 1))
				.invoke(invokers0.or_nothing)

			expect(await resolved).toEqual(2)
		})

		test("resolved oath.and should return a rejected oath of a value updated by the value of the callback returning a rejected oath", async () => {
			const resolved = Oath.Resolve(1)
				.and(x => Oath.Reject(x + 1))
				.fork(
					x => x,
					(x: any) => x + 1,
				)

			expect(await resolved).toEqual(2)
		})

		test("resolved oath.and should return a resolved oath of a value updated by the value of the callback returng a resoved promise", async () => {
			const resolved = Oath.Resolve(1)
				.and(x => Promise.resolve(x + 1))
				.invoke(invokers0.or_nothing)

			expect(await resolved).toEqual(2)
		})

		test("resolved oath.and should return a rejected oath of a value updated by the value of the callback returng a rejected promise", async () => {
			const resolved = Oath.Resolve(1)
				.and(x => Promise.reject(x + 1))
				.fork(
					x => x,
					(x: any) => x + 1,
				)

			expect(await resolved).toEqual(2)
		})

		test("rejected oath.and should return a rejected oath of unchanged value", async () => {
			const rejected = Oath.Reject(1)
				.and((x: any) => x + 1)
				.fork(
					x => x,
					x => x,
				)

			expect(await rejected).toEqual(1)
		})

		test("resolved oath.fix should return a resolved oath of unchanged value", async () => {
			const resolved = Oath.Resolve(1)
				.fix(() => 2)
				.fork(
					x => x,
					x => x,
				)

			expect(await resolved).toEqual(1)
		})

		test("rejected oath.fix should return a resolved oath of value returned by the callback", async () => {
			const rejected = Oath.Reject(1)
				.fix(x => x + 1)
				.fork(
					x => x,
					x => x + 1,
				)

			expect(await rejected).toEqual(3)
		})
	})

	describe("invokers", () => {
		test("resolved oath should fork to resolved promise with oath.toPromise", async () => {
			const resolved = Oath.Resolve(1).invoke(invokers0.to_promise)

			expect(await resolved).toEqual(1)
		})

		test("rejected oath should fork to rejected promise with oath.toPromise", () => {
			const rejected = Oath.Reject("broken").invoke(invokers0.to_promise)

			rejected.catch(v => expect(v).toEqual("broken"))
		})

		test("resolved oath should fork to resolved promise of value with oath.orNothing", async () => {
			const resolved = Oath.Resolve(1).invoke(invokers0.or_nothing)

			expect(await resolved).toEqual(1)
		})

		test("rejected oath should fork to resolved promise of undefined with oath.orNothing", async () => {
			const rejected = Oath.Reject(1).invoke(invokers0.or_nothing)

			expect(await rejected).toBeUndefined()
		})

		test("resolved oath should fork to resolved promise of value with oath.orElse", async () => {
			const resolved = Oath.Resolve(1).invoke(invokers0.or_else(() => 2))

			expect(await resolved).toEqual(1)
		})

		test("rejected oath should fork to resolved promise of callback return value with oath.orElse", async () => {
			const rejected = Oath.Reject(1).invoke(invokers0.or_else(() => 2))

			expect(await rejected).toEqual(2)
		})
	})

	describe("ops", () => {
		test("resolved oath.map should return an oath of value updated by the callback", async () => {
			const resolved = Oath.Resolve(1)
				.pipe(ops0.map(x => x + 1))
				.invoke(invokers0.to_promise)

			expect(await resolved).toEqual(2)
		})

		test("rejected oath.map should return an oath of unchanged value", async () => {
			const rejected = Oath.Reject(1)
				.pipe(ops0.map((x: any) => x + 1))
				.fix(x => x)
				.invoke(invokers0.to_promise)

			expect(await rejected).toEqual(1)
		})

		test("resolved oath.rejectedMap should return an oath of unchanged value", async () => {
			const resolved = Oath.Resolve(1)
				.pipe(ops0.rejected_map((x: any) => x + 1))
				.invoke(invokers0.to_promise)

			expect(await resolved).toEqual(1)
		})

		test("rejected oath.rejectedMap should return an oath of value updated by the callback", async () => {
			const rejected = Oath.Reject(1)
				.pipe(ops0.rejected_map(x => x + 1))
				.fix(x => x)
				.invoke(invokers0.to_promise)

			expect(await rejected).toEqual(2)
		})

		test("resolved oath.chain should return a resolved oath of value updated by the callback returning a resolved oath", async () => {
			const resolved = Oath.Resolve(1)
				.pipe(ops0.chain(x => Oath.Resolve(x + 1)))
				.invoke(invokers0.to_promise)

			expect(await resolved).toEqual(2)
		})

		test("resolved oath.chain should return a rejected oath of value updated by the callback returning a rejected oath", async () => {
			const rejected = Oath.Resolve(1)
				.pipe(ops0.chain(x => Oath.Reject(x + 1)))
				.fork(
					x => x,
					x => x,
				)

			expect(await rejected).toEqual(2)
		})

		test("rejected oath.chain should return an oath of unchanged value", async () => {
			const rejected = Oath.Reject(1)
				.pipe(ops0.chain((x: any) => Oath.Resolve(x + 1)))
				.fork(
					x => x,
					x => x,
				)

			expect(await rejected).toEqual(1)
		})

		test("resolved oath.rejectedChain should return an oath of unchanged value", async () => {
			const resolved = Oath.Resolve(1)
				.pipe(ops0.rejected_chain((x: any) => Oath.Resolve(x + 1)))
				.fork(
					x => x,
					x => x,
				)

			expect(await resolved).toEqual(1)
		})

		test("rejected oath.rejectedChain should return a rejected oath of value updated by the callback returning a resolved oath", async () => {
			const rejected = Oath.Reject<number, number>(1)
				.pipe(ops0.rejected_chain(x => Oath.Resolve(x + 1)))
				.fork(
					x => x,
					x => x,
				)

			expect(await rejected).toEqual(2)
		})

		test("rejected oath.rejectedChain should return a rejected oath of value updated by the callback returning a rejected oath", async () => {
			const rejected = Oath.Reject(1)
				.pipe(ops0.rejected_chain(x => Oath.Reject(x + 1)))
				.fork(
					x => x,
					x => x,
				)

			expect(await rejected).toEqual(2)
		})

		// --- bimap0 ---

		test("resolved oath.bimap should return a resolved oath of value updated by the second callback", async () => {
			const resolved = Oath.Resolve(1)
				.pipe(
					ops0.bimap(
						(x: any) => x + 2,
						x => x + 1,
					),
				)
				.invoke(invokers0.to_promise)

			expect(await resolved).toEqual(2)
		})

		test("rejected oath.bimap should return a rejected oath of value updated by the first callback", async () => {
			const rejected = Oath.Reject(1)
				.pipe(
					ops0.bimap(
						x => x + 2,
						(x: any) => x + 1,
					),
				)
				.fix(x => x)
				.invoke(invokers0.to_promise)

			expect(await rejected).toEqual(3)
		})

		test("resolved oath.tap should call the first function and return a resolved oath of unchanged value", async () => {
			const onResolved = mock((x: number) => x + 1)
			const onRejected = mock((x: number) => x + 2)

			const resolved = Oath.Resolve(1)
				.pipe(ops0.tap(onResolved, onRejected))
				.fork(
					x => x,
					x => x,
				)

			expect(await resolved).toEqual(1)
			expect(onResolved).toHaveBeenCalledTimes(1)
			expect(onRejected).not.toHaveBeenCalled()
		})

		test("rejected oath.tap should call the second function and return a rejected oath of unchanged value", async () => {
			const onResolved = mock((x: number) => x + 1)
			const onRejected = mock((x: number) => x + 2)

			const rejected = Oath.Reject(1)
				.pipe(ops0.tap(onResolved, onRejected))
				.fork(
					x => x,
					x => x,
				)

			expect(await rejected).toEqual(1)
			expect(onRejected).toHaveBeenCalledTimes(1)
			expect(onResolved).not.toHaveBeenCalled()
		})

		test("resolved oath.swap should return a rejected oath of unchanged values", async () => {
			const resolved = Oath.Resolve(1).pipe(ops0.swap).invoke(invokers0.or_nothing)
			const resolved2 = Oath.Resolve(1)
				.pipe(ops0.chain(() => Oath.Reject(2)))
				.pipe(ops0.swap)
				.fork(
					x => x,
					x => x,
				)

			expect(await resolved).toBeUndefined()
			expect(await resolved2).toEqual(2)
		})

		test("rejected oath.swap should return a resolved oath of unchanged value", async () => {
			const rejected = Oath.Reject(1).pipe(ops0.swap).invoke(invokers0.or_nothing)

			expect(await rejected).toEqual(1)
		})
	})
})
