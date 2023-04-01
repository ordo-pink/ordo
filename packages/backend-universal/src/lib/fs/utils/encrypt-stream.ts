import type { Stream, Writable } from "stream"
import { OrdoFilePath } from "@ordo-pink/fs-entity"
import { encryptStream, decryptStream } from "../module/crypto"
export enum ENCRYPT_ACTION {
  ENCRYPT,
  DECRYPT,
}
export const processStream = (
  path: OrdoFilePath,
  input: Stream,
  output?: Writable,
  shouldEncrypt: ENCRYPT_ACTION = 0,
) =>
  path.endsWith(".metadata")
    ? shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
      ? input
      : input.pipe(output)
    : shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
    ? encryptStream(input)
    : input.pipe(decryptStream(output))
