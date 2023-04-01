import { createHash } from "crypto"
import { encrypter } from "@ordo/backend-encrypter"

const rawKey: string = process.env.ORDO_BACKEND_INTERNAL_ENCRYPTION_KEY || "default"

const digest = createHash("sha256")
digest.update(rawKey)

const { encryptStream, decryptStream } = encrypter("aes-256-cbc")(digest.digest())

export { encryptStream, decryptStream }
