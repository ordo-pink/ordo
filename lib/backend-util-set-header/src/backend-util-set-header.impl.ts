/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export const set_header =
	(key: string, value: string) =>
	<$TIntake extends { headers: Record<string, string> }>(intake: $TIntake) => {
		intake.headers[key] = value
	}

export const set_content_type_application_json_header = set_header("Content-Type", "application/json")
