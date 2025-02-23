/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaCallback } from "@ordo-pink/maoka"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"

export const HTML_TAGS = [
	"a",
	"abbr",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"bdi",
	"bdo",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colgroup",
	"data",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"menu",
	"meta",
	"meter",
	"nav",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"svg",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"u",
	"ul",
	"var",
	"video",
	"wbr",
] as const

export const MaokaStyled = {
	class: (tag: string, classes?: string) => (callback: TMaokaCallback) =>
		Maoka.create(tag, props => {
			if (classes) props.element.setAttribute("class", classes)
			return callback(props)
		}),

	style: (tag: string, styles?: Partial<CSSStyleDeclaration>) => (callback: TMaokaCallback) =>
		Maoka.create(tag, props => {
			if (styles && MaokaDOM.is_maoka_dom_element(props.element))
				Object.keys(styles).forEach(key => ((props.element as HTMLElement).style[key as any] = styles[key as any]!))

			return callback(props)
		}),

	Tags: HTML_TAGS.reduce(
		(acc, tag) => ({
			...acc,
			[tag]: (class_or_style?: string | Partial<CSSStyleDeclaration>) => {
				if (typeof class_or_style === "string") return MaokaStyled.class(tag, class_or_style)
				return MaokaStyled.style(tag, class_or_style)
			},
		}),
		{} as Record<
			(typeof HTML_TAGS)[number],
			(class_or_style?: string | Partial<CSSStyleDeclaration>) => (callback: TMaokaCallback) => ReturnType<typeof Maoka.create>
		>,
	),

	Just: HTML_TAGS.reduce(
		(acc, tag) => ({
			...acc,
			[tag]: (callback: TMaokaCallback) => Maoka.create(tag, callback),
		}),
		{} as Record<(typeof HTML_TAGS)[number], (callback: TMaokaCallback) => ReturnType<typeof Maoka.create>>,
	),
}
