/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Colonoscope } from "@ordo-pink/oss-colonoscope"

declare global {
	export namespace OrdoClient.Activity {
		export type State = { activities: { items: Instance[]; current?: Instance & { params: Colonoscope.Results } } }

		export type Route = `/${string}`

		export type OnUnmountArgs = {
			icon?: HTMLSpanElement
			sidebar?: HTMLDivElement
			workspace?: HTMLDivElement
		}

		export type OnUnmount = (args: OnUnmountArgs) => void

		export type RenderIcon = (span: HTMLSpanElement) => void | Promise<void>

		export type RenderSidebar = (div: HTMLDivElement) => void | Promise<void>

		export type RenderWorkspace = (div: HTMLDivElement) => void | Promise<void>

		export type ID = string

		export type Instance = {
			id: ID
			readable_name: OrdoClient.Translations.Key
			routes: Route[]
			start_route?: Route
			onunmount?: OnUnmount
			render_icon?: RenderIcon
			render_sidebar?: RenderSidebar
			render_workspace?: RenderWorkspace
		}
	}
}

export {}
