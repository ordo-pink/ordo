import type { Readable, Writable } from "stream"
import { Encrypter, OrdoFilePath } from "@ordo-pink/common-types"

export enum ENCRYPT_ACTION {
  ENCRYPT,
  DECRYPT,
}

export const processStream =
  ({ encryptStream, decryptStream }: Encrypter) =>
  (path: OrdoFilePath, input: Readable, output?: Writable, shouldEncrypt: ENCRYPT_ACTION = 0) =>
    path.endsWith(".metadata")
      ? shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
        ? input
        : input.pipe(output)
      : shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
      ? encryptStream(input)
      : input.pipe(decryptStream(output))
