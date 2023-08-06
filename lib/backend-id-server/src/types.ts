import { JTI, SUB } from "#lib/backend-token-service/mod.ts"

export type AuthResponse = {
	accessToken: string
	jti: JTI
	sub: SUB
}
