import type { Stream, Writable } from "stream"
import { OrdoFilePath } from "@ordo-pink/common-types"
import { Encrypt } from "../../types"

export enum ENCRYPT_ACTION {
  ENCRYPT,
  DECRYPT,
}

export const processStream =
  ({ encryptStream, decryptStream }: Encrypt) =>
  (path: OrdoFilePath, input: Stream, output?: Writable, shouldEncrypt: ENCRYPT_ACTION = 0) =>
    path.endsWith(".metadata")
      ? shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
        ? input
        : input.pipe(output)
      : shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
      ? encryptStream(input)
      : input.pipe(decryptStream(output))
