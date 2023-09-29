// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export const Rrr = {
	INVALID_KEY: "Invalid key" as const,
	INVALID_TOKEN: "Invalid token" as const,
	INVALID_PAYLOAD: "Invalid payload" as const,
	ALG_KEY_MISMATCH: "Algorithm and key mismatch" as const,
	TOKEN_NOT_PROVIDED: "Token not provided" as const,
	VERIFICATION_FAILED: "Verification failed" as const,
}

export type RRRKey = keyof typeof Rrr

export type RRR<Key extends RRRKey> = (typeof Rrr)[Key]
