import type { Path, MDFile, WithBody } from "../../../global-context/types"

import { createMDFileFrontmatter, createMDFile } from "../../../global-context/init"
import { getFrontmatter } from "../../../md-tools/get-frontmatter"
import { getFileContent } from "./get-file-content"

export async function getMarkdownFile(path: Path): Promise<WithBody<MDFile>> {
	const arbitraryFile = await getFileContent(path)
	const frontmatter = createMDFileFrontmatter(getFrontmatter(arbitraryFile.body))

	return createMDFile(arbitraryFile, frontmatter, arbitraryFile.body) as WithBody<MDFile>
}
