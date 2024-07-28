// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
	useCurrentLanguage,
	useScopedTranslation,
	useTranslation,
} from "./src/use-translations.hook"
import { useCurrentRoute, useRouteParams } from "./src/use-route.hook"
import { useCommands } from "./src/use-commands.hook"
import { useDebouncedValue } from "./src/use-debounce.hook"
import { useFetch } from "./src/use-fetch.hook"
import { useHosts } from "./src/use-hosts.hook"
import { useIsApple } from "./src/use-is-apple.hook"
import { useIsAuthenticated } from "./src/use-is-authenticated.hook"
import { useIsDarkTheme } from "./src/use-is-dark-theme.hook"
import { useIsDev } from "./src/use-is-dev.hook"
import { useIsMobile } from "./src/use-is-mobile.hook"
import { useIsPWA } from "./src/use-is-pwa.hook"
import { useLogger } from "./src/use-logger.hook"
import { useOrdoContext } from "./src/use-ordo-context.hook"
import { useStrictSubscription } from "./src/use-strict-subscription.hook"
import { useSubscription } from "./src/use-subscription.hook"
import { useWindowSize } from "./src/use-window-size.hook"

export { create_ordo_context } from "./src/use-ordo-context.hook"

// export * from "./src/use-accelerator.hook"
// export * from "./src/use-content.hook"
// export * from "./src/use-data.hook"
// export * from "./src/use-persisted-state.hook"
// export * from "./src/use-is-authenticated.hook"
// export * from "./src/use-logger.hook"
// export * from "./src/use-public-user-info.hook"
// export * from "./src/use-readable-size.hook"
// export * from "./src/use-strict-subscription.hook"
// export * from "./src/use-user.hook"
// export * from "./src/use-workspace-width.hook"

export const use$ = {
	commands: useCommands,
	debounce: useDebouncedValue,
	is_apple: useIsApple,
	is_authenticated: useIsAuthenticated,
	is_dark_theme: useIsDarkTheme,
	is_mobile: useIsMobile,
	is_pwa: useIsPWA,
	is_dev: useIsDev,
	hosts: useHosts,
	logger: useLogger,
	ordo_context: useOrdoContext,
	current_route: useCurrentRoute,
	route_params: useRouteParams,
	subscription: useSubscription,
	strict_subscription: useStrictSubscription,
	translation: useTranslation,
	scoped_translation: useScopedTranslation,
	current_language: useCurrentLanguage,
	window_size: useWindowSize,
	fetch: useFetch,
}
