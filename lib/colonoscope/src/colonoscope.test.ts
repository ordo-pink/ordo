/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"

import { colonoscope, is_colonoscopy_doctor } from "./colonoscope.impl"

test("colonoscope should pass", () => {
	expect(colonoscope).toBeFunction()
})

test("colonoscope should return null if provided path has no params", () => {
	expect(colonoscope("/hello", "/hello")).toBeNull()
})

test("colonoscope should return null if there are no parts", () => {
	expect(colonoscope("", "")).toBeNull()
})

test("colonoscope should return null if there are no parts", () => {
	expect(colonoscope("", "")).toBeNull()
})

test("colonoscope should return null if the patient does not match", () => {
	expect(colonoscope("/:id", "/")).toBeNull()
})

test("colonoscope shoult return params of the colonized route", () => {
	expect(colonoscope("/:id", "/1")).toEqual({ id: "1" })
})

test("colonoscope shoult return params of the colonized route for multiple params", () => {
	expect(colonoscope("/:id/:name", "/1/hey")).toEqual({ id: "1", name: "hey" })
})

test("is_colonoscope_patient should properly detect if provided value is a patient", () => {
	expect(is_colonoscopy_doctor("/:id")).toBeTrue()
	expect(is_colonoscopy_doctor("/hello/world")).toBeFalse()
})
