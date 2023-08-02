import { TTokenService } from "#lib/backend-token-service/mod.ts"

export type AuthResponse = {
	accessToken: string
	jti: TTokenService.JTI
	sub: TTokenService.SUB
}
