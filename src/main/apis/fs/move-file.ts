import { rename } from "fs"

export const move = (initialPath: string, newPath: string): Promise<void> =>
	new Promise((resolve, reject) =>
		rename(initialPath, newPath, (err) => {
			if (err) {
				reject(err)
			}

			resolve()
		}),
	)
