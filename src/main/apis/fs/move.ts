import { promises } from "fs"

export function move(initialPath: string, newPath: string): Promise<void> {
	return promises.rename(initialPath, newPath)
}
