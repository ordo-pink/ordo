/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	namespace OrdoClient.FileAssociation {
		export type Id = string

		export type RenderFn = (params: RenderParams) => void | Promise<void>

		export type RenderIconFn = (span: HTMLSpanElement) => void | Promise<void>

		export type Type = { type: Ordo.Data.ContentType }

		export type State = { fa: Instance[] }

		export type Instance = {
			id: Id
			render_file_icon?: RenderIconFn
			render: RenderFn
			types: Type[]
		}

		export type RenderParams = {
			div: HTMLDivElement
			is_editable: boolean
			is_embedded: boolean
			data: Ordo.Data.Instance
		}
	}
}

export {}
