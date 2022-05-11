import { Either, Switch } from "or-else";

import { OrdoFile } from "@modules/file-explorer/types";
import { ImageViewer } from "@modules/editor/components/image-viewer";
import { TextEditor } from "@modules/editor/components/text-editor";
import { NoOp } from "@utils/no-op";

export const useEditorComponent = (file?: OrdoFile | null) =>
	Either.fromNullable(file)
		.map((f) => Switch.of(f.type).case("image", ImageViewer).default(TextEditor))
		.fold(
			() => NoOp,
			(Component) => Component,
		);
