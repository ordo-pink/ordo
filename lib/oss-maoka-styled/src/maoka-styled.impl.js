/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/** @import * as MaokaStyled from "./maoka-styled.types.ts" */

import maoka from "@ordo-pink/oss-maoka"
import maoka_dom from "@ordo-pink/oss-maoka/dom"
import * as STYLED from "./maoka-styled.constants.js"

/** @type {MaokaStyled.Instance} */
const tags = STYLED.HTML_TAGS.reduce(
	(acc, tag) => ({
		...acc,
		[tag]: (classes, on_create) => args =>
			maoka.create(tag, args => {
				if (classes) args.use(maoka_dom.jabs.if_dom(n => n.value.setAttribute("class", classes)))
				on_create && on_create(args)

				return args.kindergarten
			})(args),
	}),
	{},
)

export default tags
