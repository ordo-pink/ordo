// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { expect, mock, test } from "bun:test"

import { Oath, oathify } from "./impl"

// --- oathify ---

test("oathify should properly wrap a function that returns a promise into a function that returns an oath", async () => {
	const givePromise = () => new Promise<number>(resolve => setTimeout(() => resolve(1), 100))
	const giveOath = oathify(givePromise)
	const givenResult = giveOath()
		.map(x => x + 1)
		.toPromise()

	const takePromise = () => new Promise<number>((_, reject) => setTimeout(() => reject(1), 100))
	const takeOath = oathify(takePromise)
	const takenResult = takeOath()
		.map(x => x + 1)
		.orElse(() => 3)

	expect(await givenResult).toEqual(2)
	expect(await takenResult).toEqual(3)
})

// --- Oath.of ---

test("Oath.of should create a resolved oath of provided value", async () => {
	const resolved = Oath.of(1).orNothing()

	expect(await resolved).toEqual(1)
})

// --- Oath.resolve ---

test("Oath.resolve should create a resolved oath of provided value", async () => {
	const resolved = Oath.resolve(1).orNothing()

	expect(await resolved).toEqual(1)
})

// --- Oath.empty ---

test("Oath.empty should create a resolved oath of undefined", async () => {
	const resolved = Oath.empty().orNothing()

	expect(await resolved).toBeUndefined()
})

// --- Oath.reject ---

test("Oath.reject should create a rejected oath of provided value", async () => {
	const resolved = Oath.reject(1).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

// --- Oath.fromNullable ---

test("Oath.fromNullable should create a rejected oath of null if provided value is nullish (null or undefined)", async () => {
	const rejected = Oath.fromNullable(null).fork(
		x => x,
		x => x,
	)

	expect(await rejected).toBeNull()
})

test("Oath.fromNullable should create a resolved oath of provided value if the value is not nullish (null or undefined", async () => {
	const resolved = Oath.fromNullable(0).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(0)
})

// --- Oath.fromBoolean ---

test("Oath.fromBoolean should create a resolved oath if provided predicate returns true", async () => {
	const resolved = Oath.fromBoolean(
		() => true,
		() => 1,
	).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

test("Oath.fromBoolean should create a rejected oath of null if provided predicate returns false and no onFalse callback is provided", async () => {
	const resolved = Oath.fromBoolean(
		() => false,
		() => 1,
	).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toBeNull()
})

test("Oath.fromBoolean should create a rejected oath of value returned by onFalse callback if provided predicate returns false", async () => {
	const resolved = Oath.fromBoolean(
		() => false,
		() => 1,
		() => 2,
	).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(2)
})

// --- Oath.try ---

test("Oath.try should create a resolved oath of value returned by the provided callback if it does not throw", async () => {
	const resolved = Oath.try(() => 1).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

test("Oath.try should created a rejected oath of error thrown by the provided callback", async () => {
	const rejected = Oath.try(() => {
		throw new Error("Oops")
	}).fork(
		x => x,
		x => x,
	)

	expect(await rejected).toBeInstanceOf(Error)
})

// --- Oath.ifElse ---

test("Oath.ifElse should create a resolved oath if provided predicate returns true", async () => {
	const resolved = Oath.of(1)
		.chain(Oath.ifElse(() => true, { onTrue: x => x + 1 }))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(2)
})

test("Oath.ifElse should create a rejected oath of null if provided predicate returns false and no onFalse callback is provided", async () => {
	const resolved = Oath.of(1)
		.chain(Oath.ifElse(() => false, { onTrue: x => x + 1 }))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(1)
})

test("Oath.ifElse should create a rejected oath of value returned by onFalse callback if provided predicate returns false", async () => {
	const resolved = Oath.of(1)
		.chain(Oath.ifElse(() => false, { onTrue: () => 1, onFalse: x => x + 2 }))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(3)
})

// --- Oath.from ---

test("Oath.from should create a resolved oath from provided resolved promise thunk", async () => {
	const resolved = Oath.from(() => Promise.resolve(1)).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

test("Oath.from should create a rejected oath from provided rejected promise thunk", async () => {
	const resolved = Oath.from(() => Promise.reject(1)).fork(
		x => x,
		x => (x as any) + 1,
	)

	expect(await resolved).toEqual(1)
})

// --- Oath.all ---

test("Oath.all should create a resolved oath of array of resolved provided values", async () => {
	const resolved = await Oath.all([0, Promise.resolve(1), Oath.of(2)]).fork(
		x => x,
		x => x,
	)

	expect(resolved[0]).toEqual(0)
	expect(resolved[1]).toEqual(1)
	expect(resolved[2]).toEqual(2)
})

test("Oath.all should create a rejected oath of the first rejected value if at least one of the provided values rejects on resolution", async () => {
	const resolved = await Oath.all([0, Promise.reject("fails"), Oath.of(2)]).fork(
		x => x,
		x => x,
	)

	expect(resolved).toEqual("fails")
})

test("Oath.all should create a resolved oath of record of resolved provided values", async () => {
	const resolved = await Oath.all({ a: 0, b: Promise.resolve(1), c: Oath.of(2) }).fork(
		x => x,
		x => x,
	)

	expect(resolved.a).toEqual(0)
	expect(resolved.b).toEqual(1)
	expect(resolved.c).toEqual(2)
})

test("Oath.all should create a rejected oath of the first rejected value if at least one of the provided values rejects on resolution", async () => {
	const resolved = await Oath.all({ a: 0, b: Promise.reject("fails"), c: Oath.of(2) }).fork(
		x => x,
		x => x,
	)

	expect(resolved).toEqual("fails")
})

// --- oath.fork ---

test("resolved oath should fork to resolved promise with oath.fork", async () => {
	const resolved = Oath.resolve(1).fork(
		x => x,
		x => x,
	)

	expect(await resolved).toEqual(1)
})

test("rejected oath should fork to resolved promise with oath.fork", async () => {
	const rejected = Oath.reject(1).fork(
		x => x,
		x => x,
	)

	expect(await rejected).toEqual(1)
})

// --- oath.toPromise ---

test("resolved oath should fork to resolved promise with oath.toPromise", async () => {
	const resolved = Oath.resolve(1).toPromise()

	expect(await resolved).toEqual(1)
})

test("rejected oath should fork to rejected promise with oath.toPromise", () => {
	const rejected = Oath.reject("broken").toPromise()

	expect(async () => await rejected).toThrow("broken")
})

// --- oath.orNothing ---

test("resolved oath should fork to resolved promise of value with oath.orNothing", async () => {
	const resolved = Oath.resolve(1).orNothing()

	expect(await resolved).toEqual(1)
})

test("rejected oath should fork to resolved promise of undefined with oath.orNothing", async () => {
	const rejected = Oath.reject(1).orNothing()

	expect(await rejected).toBeUndefined()
})

// --- oath.orElse ---

test("resolved oath should fork to resolved promise of value with oath.orElse", async () => {
	const resolved = Oath.resolve(1).orElse(() => 2)

	expect(await resolved).toEqual(1)
})

test("rejected oath should fork to resolved promise of callback return value with oath.orElse", async () => {
	const rejected = Oath.reject(1).orElse(() => 2)

	expect(await rejected).toEqual(2)
})

// --- oath.map ---

test("resolved oath.map should return an oath of value updated by the callback", async () => {
	const resolved = Oath.resolve(1)
		.map(x => x + 1)
		.toPromise()

	expect(await resolved).toEqual(2)
})

test("rejected oath.map should return an oath of unchanged value", async () => {
	const rejected = Oath.reject(1)
		.map(x => (x as any) + 1)
		.fix(x => x)
		.toPromise()

	expect(await rejected).toEqual(1)
})

// --- oath.rejectedMap ---

test("resolved oath.rejectedMap should return an oath of unchanged value", async () => {
	const resolved = Oath.resolve(1)
		.rejectedMap(x => (x as any) + 1)
		.toPromise()

	expect(await resolved).toEqual(1)
})

test("rejected oath.rejectedMap should return an oath of value updated by the callback", async () => {
	const rejected = Oath.reject(1)
		.rejectedMap(x => x + 1)
		.fix(x => x)
		.toPromise()

	expect(await rejected).toEqual(2)
})

// --- oath.chain ---

test("resolved oath.chain should return a resolved oath of value updated by the callback returning a resolved oath", async () => {
	const resolved = Oath.resolve(1)
		.chain(x => Oath.of(x + 1))
		.toPromise()

	expect(await resolved).toEqual(2)
})

test("resolved oath.chain should return a rejected oath of value updated by the callback returning a rejected oath", async () => {
	const rejected = Oath.resolve(1)
		.chain(x => Oath.reject(x + 1))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(2)
})

test("rejected oath.chain should return an oath of unchanged value", async () => {
	const rejected = Oath.reject(1)
		.chain(x => Oath.of((x as any) + 1))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(1)
})

// --- oath.rejectedChain ---

test("resolved oath.rejectedChain should return an oath of unchanged value", async () => {
	const resolved = Oath.resolve(1)
		.rejectedChain(x => Oath.of((x as any) + 1))
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(1)
})

test("rejected oath.rejectedChain should return a rejected oath of value updated by the callback returning a resolved oath", async () => {
	const rejected = Oath.reject<number, number>(1)
		.rejectedChain(x => Oath.of(x + 1))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(2)
})

test("rejected oath.rejectedChain should return a rejected oath of value updated by the callback returning a rejected oath", async () => {
	const rejected = Oath.reject(1)
		.rejectedChain(x => Oath.reject(x + 1))
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(2)
})

// --- oath.bimap ---

test("resolved oath.bimap should return a resolved oath of value updated by the second callback", async () => {
	const resolved = Oath.resolve(1)
		.bimap(
			x => (x as any) + 2,
			x => x + 1,
		)
		.toPromise()

	expect(await resolved).toEqual(2)
})

test("rejected oath.bimap should return a rejected oath of value updated by the first callback", async () => {
	const rejected = Oath.reject(1)
		.bimap(
			x => x + 2,
			x => (x as any) + 1,
		)
		.fix(x => x)
		.toPromise()

	expect(await rejected).toEqual(3)
})

// --- oath.tap ---

test("resolved oath.tap should call the first function and return a resolved oath of unchanged value", async () => {
	const onResolved = mock((x: number) => x + 1)
	const onRejected = mock((x: number) => x + 2)

	const resolved = Oath.resolve(1)
		.tap(onResolved, onRejected)
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

	const rejected = Oath.reject(1)
		.tap(onResolved, onRejected)
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(1)
	expect(onRejected).toHaveBeenCalledTimes(1)
	expect(onResolved).not.toHaveBeenCalled()
})

// --- oath.swap ---

test("resolved oath.swap should return a rejected oath of unchanged values", async () => {
	const resolved = Oath.resolve(1).swap().orNothing()
	const resolved2 = Oath.resolve(1)
		.chain(() => Oath.reject(2))
		.swap()
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toBeUndefined()
	expect(await resolved2).toEqual(2)
})

test("rejected oath.swap should return a resolved oath of unchanged value", async () => {
	const rejected = Oath.reject(1).swap().orNothing()

	expect(await rejected).toEqual(1)
})

// --- oath.and ---

test("resolved oath.and should return a resolved oath of a value updated by the callback if the callback is neither oath nor promise", async () => {
	const resolved = Oath.resolve(1)
		.and(x => x + 1)
		.orNothing()

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a resolved oath of a value updated by the value of the callback returning a resolved oath", async () => {
	const resolved = Oath.resolve(1)
		.and(x => Oath.of(x + 1))
		.orNothing()

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a rejected oath of a value updated by the value of the callback returning a rejected oath", async () => {
	const resolved = Oath.resolve(1)
		.and(x => Oath.reject(x + 1))
		.fork(
			x => x,
			x => (x as any) + 1,
		)

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a resolved oath of a value updated by the value of the callback returng a resoved promise", async () => {
	const resolved = Oath.resolve(1)
		.and(x => Promise.resolve(x + 1))
		.orNothing()

	expect(await resolved).toEqual(2)
})

test("resolved oath.and should return a rejected oath of a value updated by the value of the callback returng a rejected promise", async () => {
	const resolved = Oath.resolve(1)
		.and(x => Promise.reject(x + 1))
		.fork(
			x => x,
			x => (x as any) + 1,
		)

	expect(await resolved).toEqual(2)
})

test("rejected oath.and should return a rejected oath of unchanged value", async () => {
	const rejected = Oath.reject(1)
		.and(x => (x as any) + 1)
		.fork(
			x => x,
			x => x,
		)

	expect(await rejected).toEqual(1)
})

// --- oath.fix ---

test("resolved oath.fix should return a resolved oath of unchanged value", async () => {
	const resolved = Oath.resolve(1)
		.fix(() => 2)
		.fork(
			x => x,
			x => x,
		)

	expect(await resolved).toEqual(1)
})

test("rejected oath.fix should return a resolved oath of value returned by the callback", async () => {
	const rejected = Oath.reject(1)
		.fix(x => x + 1)
		.fork(
			x => x,
			x => x + 1,
		)

	expect(await rejected).toEqual(3)
})
