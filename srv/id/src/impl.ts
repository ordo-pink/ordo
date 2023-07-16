import { join } from "#std/path/mod.ts"
import { DenoKVUserDriver } from "#lib/deno-kv-user-driver/mod.ts"
import { DenoKVTokenDriver } from "#lib/deno-kv-token-driver/mod.ts"
import { createIDServer } from "#lib/be-id/mod.ts"
import { getKey } from "./utils/get-key.ts"
import { getc } from "#lib/getc/mod.ts"

type Config = {
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
	port: number
	origin: string
	saltRounds: number
	privateKeyFileName: string
	publicKeyFileName: string
	kvDbPath: string
}

const {
	port,
	accessTokenExpireIn,
	origin,
	refreshTokenExpireIn,
	saltRounds,
	privateKeyFileName,
	publicKeyFileName,
	kvDbPath,
} = await getc<Config>("id")

const privateKey = await getKey(
	join(Deno.cwd(), "var", "etc", "auth", privateKeyFileName),
	"private"
)
const publicKey = await getKey(
	join(Deno.cwd(), "var", "etc", "auth", publicKeyFileName),
	"public"
)

const userDriver = await DenoKVUserDriver.of(kvDbPath)
const tokenDriver = await DenoKVTokenDriver.of(kvDbPath)

const app = await createIDServer({
	userDriver,
	tokenDriver,
	origin,
	privateKey,
	publicKey,
	saltRounds,
	alg: "ES384",
	accessTokenExpireIn,
	refreshTokenExpireIn,
})

console.log(`ID server running on http://localhost:${port}`)

await app.listen({ port })
