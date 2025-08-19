/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "../maoka/maoka.types.ts"
import type * as MaokaStyled from "./maoka-styled.types.ts"
import { HTML_TAGS } from "./maoka-styled.constants.ts"
import { create } from "../maoka/maoka.impl.ts"
import { hit_if_dom } from "../dom/jabs/maoka-dom-jabs.impl.ts"

const tags: MaokaStyled.Instance = HTML_TAGS.reduce(
	(acc, tag) => ({
		...acc,
		[tag]:
			<$Args extends Maoka.BaseArgs | void = void>(
				classes?: string,
				on_create?: (args: Maoka.Args<$Args> | Maoka.Kindergarten) => void,
			) =>
			(args: $Args) =>
				create<$Args>(tag, args => {
					if (classes) args.use(hit_if_dom(n => n.value.setAttribute("class", classes)))
					on_create && on_create(args as any)

					return args.kindergarten
				})(args),
	}),
	{} as MaokaStyled.Instance,
)

export default tags
