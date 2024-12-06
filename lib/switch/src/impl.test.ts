/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 *
 */

import { expect, test } from "bun:test"
import { Switch } from "./impl"

test("should apply fall into case if the value matches", () =>
	expect(
		Switch.of(1)
			.case(1, () => true)
			.default(() => false),
	).toBeTrue())

test("should apply fall into case if the validation succeeded", () =>
	expect(
		Switch.of(1)
			.case(
				x => x === 1,
				() => true,
			)
			.default(() => false),
	).toBeTrue())

test("should apply fall into default none of the cases succeeded", () =>
	expect(
		Switch.of(2)
			.case(1, () => false)
			.case(3, () => false)
			.default(() => true),
	).toBeTrue())

test("should apply the first case where the value matched", () =>
	expect(
		Switch.of(1)
			.case(1, () => true)
			.case(1, () => false)
			.default(() => false),
	).toBeTrue())
