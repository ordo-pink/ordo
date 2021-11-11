import { rmdir } from "fs"

export const deleteFolder = (path: string): Promise<string> =>
	new Promise((resolve, reject) =>
		rmdir(path, { recursive: true }, (err) => {
			if (err) {
				reject(err)
			}

			resolve(path)
		}),
	)
