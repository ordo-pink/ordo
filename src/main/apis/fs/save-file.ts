import { writeFile } from "fs"

export const saveFile = (path: string, content: string): Promise<void> =>
	new Promise((resolve, reject) =>
		writeFile(path, content, "utf8", (err) => {
			if (err) {
				reject(err)
			}

			resolve()
		}),
	)
