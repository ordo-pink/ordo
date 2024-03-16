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

import { Oath } from "./src/impl"

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

	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.bimap(
				x => x + 1,
				x => x + 1,
			)
			.orNothing()

		oath.push(performance.now() - time)
	}

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

	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.map(x => x + 1)
			.orNothing()

		oath.push(performance.now() - time)
	}

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

	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.chain(x => Oath.of(x + 1))
			.orNothing()

		oath.push(performance.now() - time)
	}

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

	for (const i of times) {
		const time = performance.now()

		await Oath.resolve(1)
			.and(x => x + 1)
			.orNothing()

		oath.push(performance.now() - time)
	}

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

	for (const i of times) {
		const time = performance.now()

		await Oath.reject(1)
			.fix(x => x + 1)
			.orNothing()

		oath.push(performance.now() - time)
	}

	for (const i of times) {
		const time = performance.now()

		await Promise.reject(1).catch(x => x + 1)

		promise.push(performance.now() - time)
	}

	log(promise, oath, "fix", "catch")
}

testMap()
testBimap()
testChain()
testAnd()
testFix()
