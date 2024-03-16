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
