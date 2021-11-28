import { promises } from "fs"

export async function move(initialPath: string, newPath: string): Promise<void> {
	const parentPath = newPath.endsWith("/")
		? newPath.slice(0, -1).slice(0, newPath.lastIndexOf("/") + 1)
		: newPath.slice(0, newPath.lastIndexOf("/") + 1)

	try {
		await promises.stat(parentPath)
	} catch (e) {
		await promises.mkdir(parentPath, { recursive: true })
	}

	return promises.rename(initialPath, newPath).catch(console.log)
}
