import { base64 } from "#x/oak@v12.6.0/deps.ts"
import { join } from "#std/path/mod.ts"
import { cyan, green } from "#std/fmt/colors.ts"

const defaultConfig = {
	accessTokenExpireIn: 300,
	refreshTokenExpireIn: 864000,
	port: 3001,
	origin: "https://ordo.pink",
	saltRounds: 10,
	privateKeyFileName: "private.key",
	publicKeyFileName: "cert.pem",
	kvDbPath: "./var/id-db",
}

const generateDefaultConfiguration = async () => {
	const encoder = new TextEncoder()

	const etcParentPath = join(Deno.cwd(), "etc", "srv")
	const usrParentPath = join(Deno.cwd(), "usr", "srv")
	const etcPath = join(etcParentPath, "id.json")
	const usrPath = join(usrParentPath, "id.json")

	const etcParentExists = await Deno.stat(etcParentPath).catch(() => null)
	const usrParentExists = await Deno.stat(usrParentPath).catch(() => null)
	const etcExists = await Deno.stat(etcPath).catch(() => null)
	const usrExists = await Deno.stat(usrPath).catch(() => null)

	if (!etcParentExists) await Deno.mkdir(etcParentPath, { recursive: true })
	if (!usrParentExists) await Deno.mkdir(usrParentPath, { recursive: true })

	if (!etcExists)
		await Deno.writeFile(
			etcPath,
			encoder.encode(JSON.stringify(defaultConfig, null, 2))
		)
	if (!usrExists)
		await Deno.writeFile(
			usrPath,
			encoder.encode(JSON.stringify(defaultConfig, null, 2))
		)
}

const generateAuthKeys = async () => {
	const parentPath = join(Deno.cwd(), "var", "etc", "auth")

	const parentExists = await Deno.stat(parentPath).catch(() => null)

	if (!parentExists) {
		await Deno.mkdir(parentPath, { recursive: true })
	}

	const publicPath = join(parentPath, defaultConfig.publicKeyFileName)
	const privatePath = join(parentPath, defaultConfig.privateKeyFileName)

	const publicKeyExists = await Deno.stat(publicPath).catch(() => null)

	const privateKeyExists = await Deno.stat(privatePath).catch(() => null)

	if (publicKeyExists && privateKeyExists) return

	const { privateKey, publicKey } = await crypto.subtle.generateKey(
		{ name: "ECDSA", namedCurve: "P-384" },
		true,
		["sign", "verify"]
	)

	const priv = await crypto.subtle.exportKey("pkcs8", privateKey)
	const pub = await crypto.subtle.exportKey("spki", publicKey)

	const cert = `-----BEGIN PUBLIC KEY-----
${base64
	.encode(pub)
	.match(/.{1,42}/g)
	?.join("\n")}
-----END PUBLIC KEY-----`

	const key = `-----BEGIN PRIVATE KEY-----
${base64
	.encode(priv)
	.match(/.{1,42}/g)
	?.join("\n")}
-----END PRIVATE KEY-----`

	await Deno.writeFile(publicPath, new TextEncoder().encode(cert))
	await Deno.writeFile(privatePath, new TextEncoder().encode(key))
}

const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Generating auth keys...`))

	await generateAuthKeys()

	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))

	Deno.stdout.write(
		encoder.encode(
			`  ${cyan("→")} Generating configuration files in /etc/ and /usr/ ...`
		)
	)

	await generateDefaultConfiguration()

	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
}

await main()
