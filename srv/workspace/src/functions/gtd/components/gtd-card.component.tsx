// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { TextInput } from "$components/input"

export default function GDTCard() {
	return (
		<form onSubmit={e => e.preventDefault()}>
			<fieldset>
				<TextInput id="inbox" label="Add to Inbox" />
			</fieldset>
		</form>
	)
}
