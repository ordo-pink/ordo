/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export const Rrr = {
	INVALORDO_ID_KEY: "Invalid key" as const,
	INVALORDO_ID_TOKEN: "Invalid token" as const,
	INVALORDO_ID_PAYLOAD: "Invalid payload" as const,
	ALG_KEY_MISMATCH: "Algorithm and key mismatch" as const,
	TOKEN_NOT_PROVIDED: "Token not provided" as const,
	VERIFICATION_FAILED: "Verification failed" as const,
}

export type RRRKey = keyof typeof Rrr

export type RRR<Key extends RRRKey> = (typeof Rrr)[Key]
