// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { createFunction } from "@ordo-pink/create-function"

export default createFunction("com.the.test", {}, ({ getCommands, getLogger }) => {
	const commands = getCommands()
	const logger = getLogger()

	const handleHelloWorld = () => logger.info("HEY")

	commands.on("hello.world", handleHelloWorld)

	commands.emit("hello.world")

	return () => {
		commands.off("hello.world", handleHelloWorld)
	}
})
