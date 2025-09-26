/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"

export const listen: OrdoClientMaoka.Jabs.Listen =
	(e, f) =>
	({ use }) =>
		use(maoka.dom.jabs.if_dom(n => ((n.value as any)[e] = f)))

export const listen_global_event: OrdoClientMaoka.Jabs.ListenGlobalEvent =
	(k, f) =>
	({ use }) => {
		const handle_mount = () => {
			document.addEventListener(k, f)

			return () => document.removeEventListener(k, f)
		}

		use(maoka.dom.jabs.onmount(handle_mount))
	}

declare global {
	namespace OrdoClientMaoka.Jabs {
		type Listen = <$Element extends HTMLElement, $Event extends keyof $Element>(
			event: $Event extends `on${string}` ? $Event : never,
			listener: $Element[$Event],
		) => Maoka.Jab

		type ListenGlobalEvent = <$Key extends keyof DocumentEventMap>(
			key: $Key,
			listener: (event: DocumentEventMap[$Key]) => void,
		) => Maoka.Jab
	}
}
