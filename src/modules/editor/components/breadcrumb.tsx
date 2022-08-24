import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { fromBoolean } from "@utils/either";

type BreadcrumbProps = {
  pathChunk: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = React.memo(
  ({ pathChunk }) => {
    const current = useCurrentTab();

    const Icon = useFileIcon(current.file);
    const HiOutlineFolder = useIcon("HiOutlineFolder");
    const HiFolder = useIcon("HiFolder");
    const HiChevronRight = useIcon("HiChevronRight");

    const Folder = () => <HiFolder />;
    const File = () => <Icon />;

    return (
      current.file && (
        <div className="editor_breadcrumb">
          {fromBoolean(pathChunk === "").fold(
            () => (
              <div className="editor_breadcrumb_title">
                {fromBoolean(pathChunk === current.file!.readableName).fold(Folder, File)}
                <div>{pathChunk}</div>
              </div>
            ),
            () => (
              <HiOutlineFolder />
            ),
          )}
          {pathChunk !== current.file.readableName && <HiChevronRight />}
        </div>
      )
    );
  },
  (prev, next) => prev.pathChunk === next.pathChunk,
);
