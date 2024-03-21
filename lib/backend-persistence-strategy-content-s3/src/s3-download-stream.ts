// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { ReadableOptions, Stream, Transform, TransformCallback } from "stream"

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
		void this.init()
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
				this.destroy(new Error(`Unsupported data representation: ${data as string}`))
				return
			}

			data.pipe(this, { end: false })

			let streamClosed = false

			// eslint-disable-next-line @typescript-eslint/no-misused-promises
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
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	override _transform(chunk: any, _: BufferEncoding, callback: TransformCallback) {
		callback(null, chunk)
	}
}
