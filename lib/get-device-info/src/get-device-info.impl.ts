/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Switch } from "@ordo-pink/switch"

import { GetDeviceInfo } from "./get-device-info.types"

export const get_device_info: GetDeviceInfo = navigator => {
	const device = Switch.OfTrue()
		.case(/Windows/i.test(navigator.platform), () =>
			Switch.OfTrue()
				.case(/Surface/i.test(navigator.userAgent), () => "Surface")
				.default(() => "Windows PC"),
		)
		.case(/Linux/i.test(navigator.platform), () =>
			Switch.OfTrue()
				.case(/Chromebook/i.test(navigator.userAgent), () => "Chromebook")
				.default(() => "Linux PC"),
		)
		.case(/Macintosh/i.test(navigator.platform), () =>
			Switch.Match(navigator.userAgent.match(/\(Macintosh;(.*?)\)/))
				.case(null, () => "Mac")
				.default(x => `Mac ${x![1].split(";")[0].trim()}`),
		)
		.default(() => "Unknown device")

	const os = Switch.OfTrue()
		.case(/Win/i.test(navigator.platform), () => "Windows")
		.case(/Mac/i.test(navigator.platform), () => "MacOS")
		.case(/Linux/i.test(navigator.platform), () => "Linux")
		.default(() => "Unknown OS")

	const manufacturer = Switch.OfTrue()
		.case(/Windows/i.test(navigator.platform), () =>
			Switch.OfTrue()
				.case(/Surface/i.test(navigator.userAgent), () => "Microsoft")
				.case(/Lenovo/i.test(navigator.userAgent), () => "Lenovo")
				.case(/Dell/i.test(navigator.userAgent), () => "Dell")
				.case(/HP/i.test(navigator.userAgent), () => "HP")
				.case(/Huawei/i.test(navigator.userAgent), () => "Huawei")
				.default(() => "Unknown manufacturer"),
		)
		.case(/Macintosh/i.test(navigator.platform), () => "Apple")
		.case(/Linux/i.test(navigator.platform) && /Chromebook/i.test(navigator.userAgent), () => "Google")
		.default(() => "Unknown manufacturer")

	return `${manufacturer} ${device} (${os})`
}
