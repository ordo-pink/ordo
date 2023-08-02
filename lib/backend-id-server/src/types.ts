import { TTokenService } from "#lib/token-service/mod.ts"

export type AuthResponse = {
	accessToken: string
	jti: TTokenService.JTI
	sub: TTokenService.SUB
}
