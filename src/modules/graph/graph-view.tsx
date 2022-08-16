import React from "react";
import { useAppSelector } from "@core/state/store";
import { Either } from "or-else";
import { Graph } from ".";
import { NoOp } from "@utils/no-op";

export const GraphView: React.FC = () => {
  const tree = useAppSelector((state) => state.fileExplorer.tree);
  const graphSettings = useAppSelector((state) => state.app.userSettings.graph);

  return Either.fromNullable(tree).fold(NoOp, (t) => (
    <Graph
      tree={t}
      showFolders={graphSettings.showFolders}
      showLinks={graphSettings.showLinks}
      showTags={graphSettings.showTags}
    />
  ));
};
