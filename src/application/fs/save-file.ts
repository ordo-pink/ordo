import { promises } from "fs";
import { OpenOrdoFile } from "../types";
import YAML from "yaml";

export const saveFile = (file: OpenOrdoFile): Promise<void> => {
	const stringFrontmatter = file.frontmatter ? "---\n".concat(YAML.stringify(file.frontmatter)).concat("---\n") : "";

	return promises.writeFile(
		file.path,
		stringFrontmatter.concat(
			file.body
				.map((line) => {
					let str = line.slice(0, -1).join("");

					while (str.endsWith(" ")) {
						str = str.slice(0, -1);
					}

					return str;
				})
				.join("\n"),
		),
		"utf8",
	);
};
