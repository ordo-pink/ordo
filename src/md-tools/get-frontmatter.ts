import type { Frontmatter } from "../global-context/types"
import YAML from "yaml"

export function getFrontmatter(body: string): Frontmatter {
	let frontmatter

	if (body.startsWith("---")) {
		try {
			const frontmatterText = body.split("---\n")[1].replace(/\t/g, "  ")
			frontmatter = YAML.parse(frontmatterText)
		} catch (e) {
			frontmatter = {}
		}
	} else {
		frontmatter = {}
	}

	return frontmatter
}
