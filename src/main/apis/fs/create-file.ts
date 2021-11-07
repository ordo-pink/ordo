import { writeFile } from "fs"

export const createFile = (path: string): Promise<void> =>
	new Promise((resolve, reject) =>
		writeFile(path, "\n", (err) => {
			if (err) {
				reject(err)
			}

			resolve()
		}),
	)
