import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { OrdoFile } from "@modules/file-explorer/types";
import { Either, Switch } from "or-else";
import { id } from "@utils/functions";

export const useFileIcon = (file?: OrdoFile | null) => {
  const iconName = React.useMemo(
    () =>
      Either.fromNullable(file)
        .map((f) =>
          Switch.of(f.type)
            .case("image", "HiOutlinePhotograph" as const)
            .case("document", "HiOutlineDocument" as const)
            .default("HiOutlineDocumentSearch" as const),
        )
        .fold(() => "HiOutlineDocumentSearch" as const, id),
    [file, file && file.path, file && file.type, file && file.size],
  );

  const Icon = useIcon(iconName);

  return Icon;
};
