import React from "react";

import { useAppSelector } from "@core/state/store";
import { Autocomplete } from "@modules/editor/components/autocomplete";

type CaretProps = {
  visible?: boolean;
  children?: any;
};

export const Caret = React.memo(
  ({ visible = false }: CaretProps) => {
    const focused = useAppSelector((state) => state.editor.focused);

    return (
      <span
        className={`editor_caret ${focused ? "" : "editor_caret_unfocused"} relative ${visible ? "inline" : "hidden"}`}
      >
        <Autocomplete />
      </span>
    );
  },
  (prev, next) => prev.visible === next.visible,
);
