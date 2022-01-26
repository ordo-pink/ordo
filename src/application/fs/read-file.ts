import { promises } from "fs";
import { OrdoFile } from "../types";

export const readFile = (file: OrdoFile): Promise<string> =>
	promises.readFile(file.path).then((body) => {
		if (file.type === "image") {
			return `data:image/${file.extension.slice(1)};base64,${body.toString("base64")}`;
		} else {
			return body.toString("utf8");
		}
	});
