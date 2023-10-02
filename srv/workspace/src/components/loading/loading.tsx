// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Loader } from "./loader"

import "./loading.css"

export const Loading = () => {
	return (
		<div className="loading">
			<Loader />
		</div>
	)
}
