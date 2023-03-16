import { randomBytes, createCipheriv, createDecipheriv, CipherKey } from "crypto";
import { Stream, Transform, Writable } from "stream";

export const encrypter = (algorythm, options?: unknown) => (encryptionKey: CipherKey) => {
  return {
    encryptStream: (input: Stream) => {
      const iv = randomBytes(16);
      const cipher = createCipheriv(algorythm, encryptionKey, iv, options);
      let inited = false;
      return input.pipe(cipher).pipe(new Transform(
        {
          transform(chunk, _, callback) {
            if (!inited) {
              inited = true;
              this.push(Buffer.concat([iv, chunk]))
            } else {
              this.push(chunk)
            }
            callback()
          }
        }
      ))
    },
    decryptStream: (output: Writable) => {
      let iv: string;
      return new Transform({
        transform(chunk, _, callback) {
          if (!iv) {
            iv = chunk.slice(0, 16);
            const cipher = createDecipheriv(algorythm, encryptionKey, iv);
            this.pipe(cipher).pipe(output);
            this.push(chunk.slice(16));
          } else {
            this.push(chunk);
          }
          callback();
        }
      })
    }
  }
}
