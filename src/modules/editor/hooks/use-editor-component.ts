import { Switch } from "or-else";

import { OrdoFile } from "@modules/file-explorer/types";
import { ImageViewer } from "@modules/editor/components/image-viewer";
import { TextEditor } from "@modules/editor/components/text-editor";

export const useEditorComponent = (file?: OrdoFile | null) =>
	file ? Switch.of(file.type).case("image", ImageViewer).default(TextEditor) : () => null;
