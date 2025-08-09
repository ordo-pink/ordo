import { core } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oss-oath"
import { server_core } from "@ordo-pink/b-server-core"

const init = async () => {
	const public_key = Bun.env.ORDO_ID_SESSION_TOKEN_PUBLIC_KEY
	const private_key = Bun.env.ORDO_ID_SESSION_TOKEN_PRIVATE_KEY

	if (!public_key || !private_key) {
		core.logger.stout.warn("ID: Missing session token keys in your env. Generating a pair based on your config...")

		const alg_name = Bun.env.ORDO_ID_SESSION_TOKEN_ALGORITHM
		const alg_params = Bun.env.ORDO_ID_SESSION_TOKEN_ALGORITHM_PARAMS
		const { priv, pub } = await create_keys(alg_name, alg_params).cata(oath.catas.or_else(handle_creation_error))

		const dotenv_file = Bun.file(".env")
		const dotenv = await dotenv_file.text()
		await dotenv_file.write(
			dotenv
				.replace(/ORDO_ID_SESSION_TOKEN_PUBLIC_KEY=.*/, `ORDO_ID_SESSION_TOKEN_PUBLIC_KEY='${pub}'`)
				.replace(/ORDO_ID_SESSION_TOKEN_PRIVATE_KEY=.*/, `ORDO_ID_SESSION_TOKEN_PRIVATE_KEY='${priv}'`),
		)

		core.logger.stout.info(
			"ID: Added missing keys to .env (see ORDO_ID_SESSION_TOKEN_PUBLIC_KEY and ORDO_ID_SESSION_TOKEN_PRIVATE_KEY)",
		)
	}
}

// --- Internal ---

const handle_creation_error = (error: unknown) => {
	core.logger.stout.panic("ID: UNEXPECTED ERROR", error)
	process.exit(1)
}

const create_keys = (alg_name?: string, alg_params?: string) =>
	create_alg(alg_name, alg_params)
		.pipe(oath.ops.map(({ name, params }) => ({ name, ...(params as any) })))
		.pipe(oath.ops.chain(x => oath.from_promise(() => crypto.subtle.generateKey(x, true, ["sign", "verify"]))))
		.pipe(oath.ops.chain(({ privateKey, publicKey }) => oath.merge({ priv: to_jwk(privateKey), pub: to_jwk(publicKey) })))

const create_alg = (alg_name?: string, alg_params?: string) =>
	oath.merge({
		name: oath.from_nullable(alg_name),
		params: oath.from_nullable(alg_params).pipe(oath.ops.chain(server_core.oaths.to_json)),
	})

const to_jwk = (key: CryptoKey) =>
	oath.from_promise(() => crypto.subtle.exportKey("jwk", key)).pipe(oath.ops.chain(server_core.oaths.to_json))

void init()
