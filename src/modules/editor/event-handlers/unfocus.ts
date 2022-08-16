import { OrdoEventHandler } from "@core/types";

export const handleUnfocus: OrdoEventHandler<"@editor/unfocus"> = ({ draft }) => {
  draft.editor.focused = false;
};
