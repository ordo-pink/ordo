// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

type Props = { text: string }

export const PageHeader = ({ text }: Props) => (
	<h1 className="text-4xl font-black first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent">
		{text}
	</h1>
)
