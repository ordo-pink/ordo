import { OrdoEventHandler } from "@core/types";

export const handleFocus: OrdoEventHandler<"@editor/focus"> = ({ draft }) => {
  draft.editor.focused = true;
};
