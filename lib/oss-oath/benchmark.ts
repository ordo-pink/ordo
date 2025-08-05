/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { oath } from "./index.ts"

const times = new Array(100_000).fill(null)
const avg = (arr: number[]): number => arr.reduce((acc, v) => acc + v, 0) / arr.length
const log = (promises: number[], oaths: number[], oathsMethod: string, promisesMethod = "then") => {
	console.log(`oath.${oathsMethod}: ${avg(oaths).toFixed(3)}`)
	console.log(`Promise.${promisesMethod}: ${avg(promises).toFixed(3)}`)
	console.log("")
}

const test_bimap = async () => {
	const oaths = []
	const promises = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		oath
			.of(1)
			.pipe(
				oath.ops.bimap(
					x => x + 1,
					x => (x as any) + 1,
				),
			)
			.cata(oath.catas.if_ok(x => x))

		oaths.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(
			x => x + 1,
			x => x + 1,
		)

		promises.push(performance.now() - time)
	}

	log(promises, oaths, "bimap")
}

const test_map = async () => {
	const oaths = []
	const promises = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		oath
			.of(1)
			.pipe(oath.ops.map(x => x + 1))
			.cata(oath.catas.if_ok(x => x))

		oaths.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(x => x + 1)

		promises.push(performance.now() - time)
	}

	log(promises, oaths, "map")
}

const test_chain = async () => {
	const oathss = []
	const promisess = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		oath
			.of(1)
			.pipe(oath.ops.chain(x => oath.of(x + 1)))
			.cata(oath.catas.if_ok(x => x))

		oathss.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(x => Promise.resolve(x + 1))

		promisess.push(performance.now() - time)
	}

	log(promisess, oathss, "chain")
}

const test_and = async () => {
	const oaths = []
	const promises = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		oath
			.of(1)
			.pipe(oath.ops.and(x => x + 1))
			.cata(oath.catas.if_ok(x => x))

		oaths.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.resolve(1).then(x => x + 1)

		promises.push(performance.now() - time)
	}

	log(promises, oaths, "and")
}

const test_fix = async () => {
	const oaths = []
	const promises = []

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		oath
			.reject(1)
			.pipe(oath.ops.fix(x => x + 1))
			.cata(oath.catas.if_ok(x => x))

		oaths.push(performance.now() - time)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const i of times) {
		const time = performance.now()

		await Promise.reject(1).catch(x => x + 1)

		promises.push(performance.now() - time)
	}

	log(promises, oaths, "fix", "catch")
}

void test_map()
void test_bimap()
void test_chain()
void test_and()
void test_fix()
