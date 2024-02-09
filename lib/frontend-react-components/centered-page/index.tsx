// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

type Props = {
	centerX?: boolean
	centerY?: boolean
}

export default function CenteredPage({ children, centerX, centerY }: PropsWithChildren<Props>) {
	return (
		<div
			// eslint-disable-next-line tailwindcss/no-custom-classname
			className={`flex size-full flex-col ${centerX ? "items-center" : "items-start"} ${
				centerY ? "justify-center" : "justify-start"
			} min-h-screen`}
		>
			{children}
		</div>
	)
}
