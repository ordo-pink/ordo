/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const listen: <$Event extends keyof GlobalEventHandlersEventMap>(
	event: $Event,
	listener: (event: GlobalEventHandlersEventMap[$Event]) => void,
) => Maoka.Jab =
	(e, f) =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => ((n.value as any)[`on${e}`] = f)))

export const listen_global_event: <$Event extends keyof DocumentEventMap>(
	key: $Event,
	listener: (event: DocumentEventMap[$Event]) => void,
) => Maoka.Jab =
	(k, f) =>
	({ use }) => {
		const handle_mount = () => {
			document.addEventListener(k, f)

			return () => {
				document.removeEventListener(k, f)
			}
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}
