import { GraphComponent } from "@modules/graph/graph-component";
import { Kanban } from "@modules/kanban";
import { ComponentNode } from "@modules/text-parser/types";
import React from "react";

const components: Record<string, React.FC<{ node: ComponentNode }>> = {
  Kanban: Kanban,
  Graph: GraphComponent,
};

type Config = {
  isCurrentLine: boolean;
  component: string;
  node: ComponentNode;
};

export const ComponentWrapper =
  ({ isCurrentLine, component, node }: Config): React.FC =>
  ({ children }) => {
    const Component = components[component];
    const isExistComponent = typeof Component !== "undefined";

    return (
      <div>
        <span className="text-xs text-neutral-500">{children}</span>
        {!isCurrentLine && isExistComponent ? <Component node={node} /> : null}
      </div>
    );
  };
