import { OrdoFolder } from "../../../global-context/types"
import { promises } from "fs"
import YAML from "yaml"

export async function handleOrdoFolderChange(
	node: OrdoFolder,
	changes: Partial<OrdoFolder>,
): Promise<void> {
	const metadataPath = node.path.endsWith("/")
		? node.path.concat(".ordo.md")
		: node.path.concat("/.ordo")

	let metadataContent: Partial<OrdoFolder>

	try {
		const metadataString = await promises.readFile(metadataPath, "utf-8")
		metadataContent = YAML.parse(metadataString)
	} catch (e) {
		await promises.writeFile(metadataPath, "")
		metadataContent = {}
	}

	const changeKeys = Object.getOwnPropertyNames(changes) as Array<keyof OrdoFolder>

	if (changeKeys.includes("collapsed")) {
		metadataContent.collapsed = changes.collapsed
	}

	await promises.writeFile(metadataPath, YAML.stringify(metadataContent))
}
