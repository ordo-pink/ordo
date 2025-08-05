/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import chalk from "chalk"

import type { Progress } from "./cmd-progress.types"

export const create_progress: Progress.Fn = (message = "") => ({
	start: msg => {
		message += msg
		process.stdout.write(`${chalk.yellow("◌")} ${message}`)
	},
	inc: (msg = ".") => {
		message += msg
		process.stdout.write(msg)
	},
	finish: () => {
		process.stdout.moveCursor(-message.length, -Math.floor(message.length / process.stdout.columns))
		process.stdout.write(`${chalk.green("✔")} ${message}\n`)
		message = ""
	},
	break: (message: string) => {
		process.stdout.moveCursor(-message.length, -Math.floor(message.length / process.stdout.columns))
		process.stdout.write(`${chalk.red("✘")} ${message}\n`)
		message = ""
	},
})
