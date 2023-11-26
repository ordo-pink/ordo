// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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
