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

// import { test, expect } from "bun:test"
// import { Router } from "./impl"

// test("routary should map GET method", async () => {
// 	const validRequest = { url: "http://localhost:8000", method: "GET" } as Request

// 	const router = Router.create()
// 		.get("/", () => new Response("Hello"))
// 		.orElse(() => new Response("Not Found"))

// 	expect(await router(validRequest).then(res => res.text())).toEqual("Hello")
// })

// test("routary should map POST method", async () => {
// 	const validRequest = { url: "http://localhost:8000", method: "POST" } as Request

// 	const router = Router.create()
// 		.post("/", () => new Response("Hello"))
// 		.orElse(() => new Response("Not Found"))

// 	expect(await router(validRequest).then(res => res.text())).toEqual("Hello")
// })

// test("routary should map PUT method", async () => {
// 	const validRequest = { url: "http://localhost:8000", method: "PUT" } as Request

// 	const router = Router.create()
// 		.put("/", () => new Response("Hello"))
// 		.orElse(() => new Response("Not Found"))

// 	expect(await router(validRequest).then(res => res.text())).toEqual("Hello")
// })

// test("routary should map PATCH method", async () => {
// 	const validRequest = { url: "http://localhost:8000", method: "PATCH" } as Request

// 	const router = Router.create()
// 		.patch("/", () => new Response("Hello"))
// 		.orElse(() => new Response("Not Found"))

// 	expect(await router(validRequest).then(res => res.text())).toEqual("Hello")
// })

// test("routary should map DELETE method", async () => {
// 	const validRequest = { url: "http://localhost:8000", method: "DELETE" } as Request

// 	const router = Router.create()
// 		.delete("/", () => new Response("Hello"))
// 		.orElse(() => new Response("Not Found"))

// 	expect(await router(validRequest).then(res => res.text())).toEqual("Hello")
// })

// test("routary should map OPTIONS method", async () => {
// 	const validRequest = { url: "http://localhost:8000", method: "OPTIONS" } as Request

// 	const router = Router.create()
// 		.options("/", () => new Response("Hello"))
// 		.orElse(() => new Response("Not Found"))

// 	expect(await router(validRequest).then(res => res.text())).toEqual("Hello")
// })

// test("routary should run .orElse handler if route never matched", async () => {
// 	const invalidRequest = { url: "http://localhost:8000", method: "GET" } as Request

// 	const router = Router.create().orElse(() => new Response("Not Found"))

// 	expect(await router(invalidRequest).then(res => res.text())).toEqual("Not Found")
// })
