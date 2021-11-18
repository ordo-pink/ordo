import { promises } from "fs"

export function saveFile(path: string, body: string): Promise<void> {
	return promises.writeFile(path, body, "utf-8")
}
