// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath, invokers0, ops0 } from "./index.ts"

const times = new Array(100_000).fill(null)
const avg = (arr: number[]): number => arr.reduce((acc, v) => acc + v, 0) / arr.length
const log = (promise: number[], oath: number[], oathMethod: string, promiseMethod = "then") => {
	console.log(`Oath.${oathMethod}: ${avg(oath).toFixed(3)}`)
	console.log(`Promise.${promiseMethod}: ${avg(promise).toFixed(3)}`)
	console.log("")
}

const test_bimap = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.Resolve(1)
			.pipe(
				ops0.bimap(
					x => (x as any) + 1,
					x => x + 1,
				),
			)
			.invoke(invokers0.or_nothing)

		oath.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(
			x => x + 1,
			x => x + 1,
		)

		promise.push(performance.now() - time)
	}

	log(promise, oath, "bimap")
}

const test_map = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.Resolve(1)
			.pipe(ops0.map(x => x + 1))
			.invoke(invokers0.or_nothing)

		oath.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(x => x + 1)

		promise.push(performance.now() - time)
	}

	log(promise, oath, "map")
}

const test_chain = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.Resolve(1)
			.pipe(ops0.chain(x => Oath.Resolve(x + 1)))
			.invoke(invokers0.or_nothing)

		oath.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(x => Promise.resolve(x + 1))

		promise.push(performance.now() - time)
	}

	log(promise, oath, "chain")
}

const test_and = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.Resolve(1)
			.and(x => x + 1)
			.invoke(invokers0.or_nothing)

		oath.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(x => x + 1)

		promise.push(performance.now() - time)
	}

	log(promise, oath, "and")
}

const test_fix = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.Reject(1)
			.fix(x => x + 1)
			.invoke(invokers0.or_nothing)

		oath.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.reject(1).catch(x => x + 1)

		promise.push(performance.now() - time)
	}

	log(promise, oath, "fix", "catch")
}

void test_map()
void test_bimap()
void test_chain()
void test_and()
void test_fix()
