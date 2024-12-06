/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, mock, test } from "bun:test"

import { Oath } from "./impl"

// --- oathify ---

test("oathify should properly wrap a function that returns a promise into a function that returns an oath", async () => {
	const givePromise = () => new Promise<number>(resolve => setTimeout(() => resolve(1), 100))
	const giveOath = oathify(givePromise)
	const givenResult = giveOath()
		.pipe(map_oath(x => x + 1))
		.invoke(to_promise_oath)

	const takePromise = () => new Promise<number>((_, reject) => setTimeout(() => reject(1), 100))
	const takeOath = oathify(takePromise)
	const takenResult = takeOath()
		.pipe(map_oath(x => x + 1))
		.invoke(or_else_oath(() => 3))

	expect(await givenResult).toEqual(2)
	expect(await takenResult).toEqual(3)
})

// --- Oath.resolve ---

test("Oath.resolve should create a resolved oath of provided value", async () => {
	const resolved = Oath.Resolve(1).invoke(or_nothing_oath)

	expect(await resolved).toEqual(1)
})

// --- Oath.resolve ---

test("Oath.resolve should create a resolved oath of provided value", async () => {
	const resolved = Oath.Resolve(1).invoke(or_nothing_oath)

	expect(await resolved).toEqual(1)
})

// --- empty0 ---

test("empty0 should create a resolved oath of undefined", async () => {
	const resolved = empty_oath().invoke(or_nothing_oath)

	expect(await resolved).toBeUndefined()
})

// --- Oath.reject ---

test("Oath.reject should create a rejected oath of provided value", async () => {
	const resolved = Oath.Reject(1).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

// --- fromNullable0 ---

test("fromNullable0 should create a rejected oath of null if provided value is nullish (null or undefined)", async () => {
	const rejected = from_nullable_oath(null).fork(
		x => x,
		x => x,
	)

	expect(await rejected).toBeNull()
})

test("fromNullable0 should create a resolved oath of provided value if the value is not nullish (null or undefined", async () => {
	const resolved = from_nullable_oath(0).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(0)
})

// --- fromFalsy0 ---

test("fromFalsy0 should create a resolved oath if provided predicate returns true", async () => {
	const resolved = from_falsy_oath(1, 2).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

test("fromFalsy0 should create a rejected oath of null if provided predicate returns false and no onFalse callback is provided", async () => {
	const resolved = from_falsy_oath(0).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toBeNull()
})

test("fromFalsy0 should create a rejected oath of value returned by onFalse callback if provided predicate returns false", async () => {
	const resolved = from_falsy_oath(0, 1).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

// --- try0 ---

test("try0 should create a resolved oath of value returned by the provided callback if it does not throw", async () => {
	const resolved = try_oath(() => 1).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

test("try0 should created a rejected oath of error thrown by the provided callback", async () => {
	const rejected = try_oath(() => {
		throw new Error("Oops")
	}).fork(
		x => x,
		x => x,
	)

	expect(await rejected).toBeInstanceOf(Error)
})

// --- ifElse0 ---

test("ifElse0 should create a resolved oath if provided predicate returns true", async () => {
	const resolved = Oath.Resolve(1)
		.pipe(chain_oath(if_else_oath(() => true, { on_true: x => x + 1 })))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(2)
})

test("ifElse0 should create a rejected oath of null if provided predicate returns false and no onFalse callback is provided", async () => {
	const resolved = Oath.Resolve(1)
		.pipe(chain_oath(if_else_oath(() => false, { on_true: x => x + 1 })))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(1)
})

test("ifElse0 should create a rejected oath of value returned by onFalse callback if provided predicate returns false", async () => {
	const resolved = Oath.Resolve(1)
		.pipe(chain_oath(if_else_oath(() => false, { on_true: () => 1, on_false: x => x + 2 })))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(3)
})

// --- fromPromise0 ---

test("fromPromise0 should create a resolved oath from provided resolved promise thunk", async () => {
	const resolved = from_promise_oath(() => Promise.resolve(1)).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

test("fromPromise0 should create a rejected oath from provided rejected promise thunk", async () => {
	const resolved = from_promise_oath(() => Promise.reject(1)).fork(
		x => x,
		x => x + 1,
	)

	expect(await resolved).toEqual(1)
})

// --- merge0 ---

test("merge0 should create a resolved oath of array of resolved provided values", async () => {
	const resolved = await merge_oath([0, Promise.resolve(1), Oath.Resolve(2)]).fork(
		x => x,
		x => x,
	)

	expect(resolved[0]).toEqual(0)
	expect(resolved[1]).toEqual(1)
	expect(resolved[2]).toEqual(2)
})

test("merge0 should create a rejected oath of the first rejected value if at least one of the provided values rejects on resolution", async () => {
	const resolved = await merge_oath([0, Promise.reject("fails"), Oath.Resolve(2)]).fork(
		x => x,
		x => x,
	)

	expect(resolved).toEqual("fails" as any)
})

test("merge0 should create a resolved oath of record of resolved provided values", async () => {
	const resolved = await merge_oath({ a: 0, b: Promise.resolve(1), c: Oath.Resolve(2) }).fork(
		x => x,
		x => x,
	)

	expect(resolved.a).toEqual(0)
	expect(resolved.b).toEqual(1)
	expect(resolved.c).toEqual(2)
})

test("merge0 should create a rejected oath of the first rejected value if at least one of the provided values rejects on resolution", async () => {
	const resolved = await merge_oath({ a: 0, b: Promise.reject("fails"), c: Oath.Resolve(2) }).fork(
		x => x,
		x => x,
	)

	expect(resolved).toEqual("fails" as any)
})

// --- oath.fork ---

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

// --- toPromise ---

test("resolved oath should fork to resolved promise with oath.toPromise", async () => {
	const resolved = Oath.Resolve(1).invoke(to_promise_oath)

	expect(await resolved).toEqual(1)
})

test("rejected oath should fork to rejected promise with oath.toPromise", () => {
	const rejected = Oath.Reject("broken").invoke(to_promise_oath)

	rejected.catch(v => expect(v).toEqual("broken"))
})

// --- orNothing ---

test("resolved oath should fork to resolved promise of value with oath.orNothing", async () => {
	const resolved = Oath.Resolve(1).invoke(or_nothing_oath)

	expect(await resolved).toEqual(1)
})

test("rejected oath should fork to resolved promise of undefined with oath.orNothing", async () => {
	const rejected = Oath.Reject(1).invoke(or_nothing_oath)

	expect(await rejected).toBeUndefined()
})

// --- orElse ---

test("resolved oath should fork to resolved promise of value with oath.orElse", async () => {
	const resolved = Oath.Resolve(1).invoke(or_else_oath(() => 2))

	expect(await resolved).toEqual(1)
})

test("rejected oath should fork to resolved promise of callback return value with oath.orElse", async () => {
	const rejected = Oath.Reject(1).invoke(or_else_oath(() => 2))

	expect(await rejected).toEqual(2)
})

// --- oath.pipe

test("pipe should apply provided function over given Oath", async () => {
	const addOne0 = map_oath((x: number) => x + 1)
	const resolved = Oath.Resolve(1).pipe(addOne0).pipe(addOne0).pipe(addOne0).invoke(to_promise_oath)

	expect(await resolved).toEqual(4)
})

// --- map0 ---

test("resolved oath.map should return an oath of value updated by the callback", async () => {
	const resolved = Oath.Resolve(1)
		.pipe(map_oath(x => x + 1))
		.invoke(to_promise_oath)

	expect(await resolved).toEqual(2)
})

test("rejected oath.map should return an oath of unchanged value", async () => {
	const rejected = Oath.Reject(1)
		.pipe(map_oath(x => x + 1))
		.fix(x => x)
		.invoke(to_promise_oath)

	expect(await rejected).toEqual(1)
})

// --- rejectedMap0 ---

test("resolved oath.rejectedMap should return an oath of unchanged value", async () => {
	const resolved = Oath.Resolve(1)
		.pipe(rejected_map_oath(x => x + 1))
		.invoke(to_promise_oath)

	expect(await resolved).toEqual(1)
})

test("rejected oath.rejectedMap should return an oath of value updated by the callback", async () => {
	const rejected = Oath.Reject(1)
		.pipe(rejected_map_oath(x => x + 1))
		.fix(x => x)
		.invoke(to_promise_oath)

	expect(await rejected).toEqual(2)
})

// --- chain0 ---

test("resolved oath.chain should return a resolved oath of value updated by the callback returning a resolved oath", async () => {
	const resolved = Oath.Resolve(1)
		.pipe(chain_oath(x => Oath.Resolve(x + 1)))
		.invoke(to_promise_oath)

	expect(await resolved).toEqual(2)
})

test("resolved oath.chain should return a rejected oath of value updated by the callback returning a rejected oath", async () => {
	const rejected = Oath.Resolve(1)
		.pipe(chain_oath(x => Oath.Reject(x + 1)))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(2)
})

test("rejected oath.chain should return an oath of unchanged value", async () => {
	const rejected = Oath.Reject(1)
		.pipe(chain_oath(x => Oath.Resolve(x + 1)))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(1)
})

// --- rejectedChain0 ---

test("resolved oath.rejectedChain should return an oath of unchanged value", async () => {
	const resolved = Oath.Resolve(1)
		.pipe(rejected_chain_oath(x => Oath.Resolve(x + 1)))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(1)
})

test("rejected oath.rejectedChain should return a rejected oath of value updated by the callback returning a resolved oath", async () => {
	const rejected = Oath.Reject<number, number>(1)
		.pipe(rejected_chain_oath(x => Oath.Resolve(x + 1)))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(2)
})

test("rejected oath.rejectedChain should return a rejected oath of value updated by the callback returning a rejected oath", async () => {
	const rejected = Oath.Reject(1)
		.pipe(rejected_chain_oath(x => Oath.Reject(x + 1)))
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
			bimap_oath(
				x => x + 2,
				x => x + 1,
			),
		)
		.invoke(to_promise_oath)

	expect(await resolved).toEqual(2)
})

test("rejected oath.bimap should return a rejected oath of value updated by the first callback", async () => {
	const rejected = Oath.Reject(1)
		.pipe(
			bimap_oath(
				x => x + 2,
				x => x + 1,
			),
		)
		.fix(x => x)
		.invoke(to_promise_oath)

	expect(await rejected).toEqual(3)
})

// --- tap0 ---

test("resolved oath.tap should call the first function and return a resolved oath of unchanged value", async () => {
	const onResolved = mock((x: number) => x + 1)
	const onRejected = mock((x: number) => x + 2)

	const resolved = Oath.Resolve(1)
		.pipe(tap_oath(onResolved, onRejected))
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
		.pipe(tap_oath(onResolved, onRejected))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(1)
	expect(onRejected).toHaveBeenCalledTimes(1)
	expect(onResolved).not.toHaveBeenCalled()
})

// --- swap0 ---

test("resolved oath.swap should return a rejected oath of unchanged values", async () => {
	const resolved = Oath.Resolve(1).pipe(swap_oath).invoke(or_nothing_oath)
	const resolved2 = Oath.Resolve(1)
		.pipe(chain_oath(() => Oath.Reject(2)))
		.pipe(swap_oath)
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toBeUndefined()
	expect(await resolved2).toEqual(2)
})

test("rejected oath.swap should return a resolved oath of unchanged value", async () => {
	const rejected = Oath.Reject(1).pipe(swap_oath).invoke(or_nothing_oath)

	expect(await rejected).toEqual(1)
})

// --- oath.and ---

test("resolved oath.and should return a resolved oath of a value updated by the callback if the callback is neither oath nor promise", async () => {
	const resolved = Oath.Resolve(1)
		.and(x => x + 1)
		.invoke(or_nothing_oath)

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a resolved oath of a value updated by the value of the callback returning a resolved oath", async () => {
	const resolved = Oath.Resolve(1)
		.and(x => Oath.Resolve(x + 1))
		.invoke(or_nothing_oath)

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a rejected oath of a value updated by the value of the callback returning a rejected oath", async () => {
	const resolved = Oath.Resolve(1)
		.and(x => Oath.Reject(x + 1))
		.fork(
			x => x,
			x => x + 1,
		)

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a resolved oath of a value updated by the value of the callback returng a resoved promise", async () => {
	const resolved = Oath.Resolve(1)
		.and(x => Promise.resolve(x + 1))
		.invoke(or_nothing_oath)

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a rejected oath of a value updated by the value of the callback returng a rejected promise", async () => {
	const resolved = Oath.Resolve(1)
		.and(x => Promise.reject(x + 1))
		.fork(
			x => x,
			x => x + 1,
		)

	expect(await resolved).toEqual(2)
})

test("rejected oath.and should return a rejected oath of unchanged value", async () => {
	const rejected = Oath.Reject(1)
		.and(x => x + 1)
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(1)
})

// --- oath.fix ---

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
