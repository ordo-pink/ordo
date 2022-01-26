import { OrdoFolder } from "../types"

export const getFolderPaths = (tree: OrdoFolder, paths: string[] = []): string[] => {
	if (!tree) {
		return paths
	}

	for (const child of tree.children) {
		if (child.type === "folder") {
			paths.push(child.path)
			getFolderPaths(child as OrdoFolder, paths)
		}
	}

	return paths
}
