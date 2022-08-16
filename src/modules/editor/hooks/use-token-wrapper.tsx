import React from "react";

import { Node } from "@core/parser/types";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { HeadingWrapper } from "@modules/editor/node-wrappers/heading";
import { ToDoWrapper } from "@modules/editor/node-wrappers/todo";
import {
  isBoldNode,
  isCodeNode,
  isComponentNode,
  isEmbedNode,
  isHeadingNode,
  isHrNode,
  isItalicNode,
  isLinkNode,
  isStrikethroughNode,
  isTagNode,
  isToDoNode,
} from "@modules/text-parser/is";
import { ComponentWrapper } from "@modules/editor/node-wrappers/component";
import { EmbedWrapper } from "@modules/editor/node-wrappers/embed";
import { HrWrapper } from "@modules/editor/node-wrappers/hr";
import { TagWrapper } from "@modules/editor/node-wrappers/tag";
import { BoldWrapper } from "@modules/editor/node-wrappers/bold";
import { ItalicWrapper } from "@modules/editor/node-wrappers/italic";
import { CodeWrapper } from "@modules/editor/node-wrappers/code";
import { StrikethroughWrapper } from "@modules/editor/node-wrappers/strikethrough";
import { TextWrapper } from "@modules/editor/node-wrappers/text";
import { LinkWrapper } from "@modules/editor/node-wrappers/link";
import { NoOp } from "@utils/no-op";

export const useTextNodeWrapper = (node?: Node, isCurrentLine = false): React.FC => {
  const dispatch = useAppDispatch();
  const platform = useAppSelector((state) => state.app.internalSettings.platform);
  const tree = useAppSelector((state) => state.fileExplorer.tree);

  if (!node) return NoOp;

  const wrapper: React.FC = React.useMemo(() => {
    if (isHeadingNode(node)) {
      return HeadingWrapper(node.depth);
    } else if (isToDoNode(node)) {
      return ToDoWrapper({ node, isCurrentLine });
    } else if (isComponentNode(node)) {
      const component = node.raw.slice(1, node.raw.indexOf(" "));
      return ComponentWrapper({ isCurrentLine, component, node });
    } else if (isEmbedNode(node)) {
      return EmbedWrapper({ isCurrentLine, node });
    } else if (isHrNode(node)) {
      return HrWrapper({ isCurrentLine });
    } else if (isTagNode(node)) {
      return TagWrapper({ node });
    } else if (isBoldNode(node)) {
      return BoldWrapper();
    } else if (isItalicNode(node)) {
      return ItalicWrapper();
    } else if (isLinkNode(node)) {
      return LinkWrapper({ dispatch, isCurrentLine, node, platform, tree });
    } else if (isCodeNode(node)) {
      return CodeWrapper();
    } else if (isStrikethroughNode(node)) {
      return StrikethroughWrapper();
    }

    return TextWrapper();
  }, [node.type, node.raw, isCurrentLine]);

  return wrapper;
};
