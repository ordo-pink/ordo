// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Switch } from "@ordo-pink/switch"
import { PropsWithChildren } from "react"

type _P = PropsWithChildren<{
	level?: "1" | "2" | "3" | "4" | "5"
	uppercase?: boolean
	center?: boolean
	trim?: boolean
}>
export const Title = ({ level, center, uppercase, children, trim }: _P) =>
	Switch.of(level)
		.case("2", () => (
			<h2
				className={`${center ? "text-center " : ""}${uppercase ? "uppercase " : ""}${
					trim ? "text-ellipsis " : ""
				}text-xl md:text-3xl font-black max-w-full break-words first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent`}
			>
				{children}
			</h2>
		))
		.case("3", () => (
			<h3
				className={`${center ? "text-center " : ""}${uppercase ? "uppercase " : ""}${
					trim ? "text-ellipsis " : ""
				}text-lg md:text-2xl font-black max-w-full break-words first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent`}
			>
				{children}
			</h3>
		))
		.case("4", () => (
			<h4
				className={`${center ? "text-center " : ""}${uppercase ? "uppercase " : ""}${
					trim ? "text-ellipsis " : ""
				}md:text-xl font-black max-w-full break-words first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent`}
			>
				{children}
			</h4>
		))
		.case("5", () => (
			<h2
				className={`${center ? "text-center " : ""}${uppercase ? "uppercase " : ""}${
					trim ? "text-ellipsis " : ""
				}md:text-lg font-bold md:font-black max-w-full break-words first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent`}
			>
				{children}
			</h2>
		))
		.default(() => (
			<h1
				className={`${center ? "text-center " : ""}${uppercase ? "uppercase " : ""}${
					trim ? "text-ellipsis " : ""
				}text-2xl md:text-4xl font-black max-w-full break-words first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent`}
			>
				{children}
			</h1>
		))
