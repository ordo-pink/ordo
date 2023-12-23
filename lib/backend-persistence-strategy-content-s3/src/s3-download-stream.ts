// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ReadableOptions, Stream, Transform, TransformCallback } from "stream"
import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"

type S3DownloadStreamOptions = {
	readonly s3: S3Client
	readonly Bucket: string
	readonly Key: string
	readonly byteRange?: number
}

const DEFAULT_CHUNK_SIZE = 512 * 1024

export class S3DownloadStream extends Transform {
	#options: S3DownloadStreamOptions
	#currentCursorPosition = 0
	#maxContentLength = -1

	constructor(options: S3DownloadStreamOptions, nodeReadableStreamOptions?: ReadableOptions) {
		super(nodeReadableStreamOptions)
		this.#options = options
		this.init()
	}

	async init() {
		try {
			const res = await this.#options.s3.send(
				new HeadObjectCommand({ Bucket: this.#options.Bucket, Key: this.#options.Key }),
			)
			this.#maxContentLength = res.ContentLength || 0
		} catch (e) {
			this.destroy(e as Error)
			return
		}
		await this.fetchAndEmitNextRange()
	}

	async fetchAndEmitNextRange() {
		if (this.#currentCursorPosition >= this.#maxContentLength) {
			this.end()
			return
		}

		// Calculate the range of bytes we want to grab
		const range = this.#currentCursorPosition + (this.#options.byteRange ?? DEFAULT_CHUNK_SIZE)

		// If the range is greater than the total number of bytes in the file
		// We adjust the range to grab the remaining bytes of data
		const adjustedRange = range < this.#maxContentLength ? range : this.#maxContentLength

		// Set the Range property on our s3 stream parameters
		const Range = `bytes=${this.#currentCursorPosition}-${adjustedRange}`
		const { Key, Bucket } = this.#options

		// Update the current range beginning for the next go
		this.#currentCursorPosition = adjustedRange + 1

		try {
			// Grab the range of bytes from the file
			const res = await this.#options.s3.send(new GetObjectCommand({ Bucket, Key, Range }))

			const data = res?.Body || ""

			if (!(data instanceof Stream.Readable)) {
				// never encountered this error, but you never know
				this.destroy(new Error(`Unsupported data representation: ${data}`))
				return
			}

			data.pipe(this, { end: false })

			let streamClosed = false

			data.on("end", async () => {
				if (streamClosed) {
					return
				}
				streamClosed = true
				await this.fetchAndEmitNextRange()
			})
		} catch (error) {
			// If we encounter an error grabbing the bytes
			// We destroy the stream, NodeJS ReadableStream will emit the 'error' event
			this.destroy(error as Error)
			return
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	override _transform(chunk: any, _: BufferEncoding, callback: TransformCallback) {
		callback(null, chunk)
	}
}
