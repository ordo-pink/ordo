import { Readable, ReadableOptions } from "stream"
import type { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

export type S3ReadStreamOptions = {
	s3: S3Client
	command: GetObjectCommand
	maxLength: number
	byteRange?: number
}

export class S3ReadStream extends Readable {
	#s3: S3Client
	#command: GetObjectCommand
	#currentCursorPosition = 0
	#s3DataRange: number
	#maxContentLength: number

	constructor(options: S3ReadStreamOptions, nodeReadableStreamOptions?: ReadableOptions) {
		super(nodeReadableStreamOptions)
		this.#maxContentLength = options.maxLength
		this.#s3 = options.s3
		this.#command = options.command
		this.#s3DataRange = options.byteRange || 64 * 1024
	}

	private drainBuffer() {
		while (this.read());
	}

	/**
	 * Adjust size of range to grab from S3
	 *
	 * @param {number} bytes - Number of bytes to set for range
	 */
	adjustByteRange(bytes: number) {
		this.#s3DataRange = bytes
	}

	/**
	 * Drains the internal buffer and
	 * moves cursor bytes length back in file
	 *
	 * If current cursor position - number of bytes to move back
	 * is <= 0, set cursor at begining of file
	 * @param {number} bytes - Number of bytes to subtract from cursor (defaults to range)
	 */
	moveCursorBack(bytes: number = this.#s3DataRange) {
		this.drainBuffer()
		if (this.#currentCursorPosition - bytes > 0) {
			this.#currentCursorPosition -= bytes
		} else {
			this.#currentCursorPosition = 0
		}
	}

	/**
	 * Drains the internal buffer and
	 * moves cursor bytes length forward in file
	 *
	 * If current cursor position + number of bytes to move forward
	 * is > the length of the file, set cursor at end of file
	 * @param {number} bytes - Number of bytes to add to cursor (defaults to range)
	 */
	moveCursorForward(bytes: number = this.#s3DataRange) {
		this.drainBuffer()
		if (this.#currentCursorPosition + bytes <= this.#maxContentLength) {
			this.#currentCursorPosition += bytes
		} else {
			this.#currentCursorPosition += this.#maxContentLength + 1
		}
	}

	async _read() {
		if (this.#currentCursorPosition >= this.#maxContentLength) {
			this.push(null)
		} else {
			const range = this.#currentCursorPosition + this.#s3DataRange
			const adjustedRange = range < this.#maxContentLength ? range : this.#maxContentLength
			this.#command.input.Range = `bytes=${this.#currentCursorPosition}-${adjustedRange}`
			this.#currentCursorPosition = adjustedRange + 1

			try {
				const response = await this.#s3.send(this.#command)
				const data = await response.Body!.transformToByteArray()
				this.push(data)
			} catch (error) {
				this.destroy(error as Error)
			}
		}
	}
}
