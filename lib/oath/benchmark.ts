// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "./src/impl"
import { bimap0 } from "./operators/bimap"
import { chain0 } from "./operators/chain"
import { map0 } from "./operators/map"
import { orNothing } from "./invokers/or-nothing"

const times = new Array(10_000).fill(null)
const avg = (arr: number[]): number => arr.reduce((acc, v) => acc + v, 0) / arr.length
const log = (promise: number[], oath: number[], oathMethod: string, promiseMethod = "then") => {
	console.log(`Oath.${oathMethod}: ${avg(oath).toPrecision(2)}`)
	console.log(`Promise.${promiseMethod}: ${avg(promise).toPrecision(2)}`)
	console.log("")
}

const testBimap = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.pipe(
				bimap0(
					x => (x as any) + 1,
					x => x + 1,
				),
			)
			.invoke(orNothing)

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

const testMap = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.pipe(map0(x => x + 1))
			.invoke(orNothing)

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

const testChain = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.pipe(chain0(x => Oath.resolve(x + 1)))
			.invoke(orNothing)

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

const testAnd = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.and(x => x + 1)
			.invoke(orNothing)

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

const testFix = async () => {
	const oath = []
	const promise = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Oath.reject(1)
			.fix(x => x + 1)
			.invoke(orNothing)

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

void testMap()
void testBimap()
void testChain()
void testAnd()
void testFix()
