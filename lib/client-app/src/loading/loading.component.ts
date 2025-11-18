/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_cloud_download } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"

import "./loading.styles.css"

export const page_loading = maoka.create("div", ({ use }) => {
	use(ordo_client_maoka.jabs.set_class("loader"))

	return () => bs_cloud_download({ classes: "loader_icon" })
})
