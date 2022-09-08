import React, { PropsWithChildren } from "react";
import SplitView from "react-split";

import "@containers/split-view/index.css";
import { SplitDirection } from "./split-direction";

type Props = PropsWithChildren<{
  sizes: [number, number];
  direction: SplitDirection;
  onDragEnd: (sizes: [number, number]) => void;
  minSize?: number;
  snapOffset?: number;
}>;

/**
 * Splits the parent element horizontally, providing a draggable SVG to control the width
 * of the items.
 */
const Split = ({ sizes, direction, onDragEnd, minSize = 0, snapOffset = 0, children }: Props) => (
  <SplitView
    className={`split-view ${direction}`}
    sizes={sizes}
    minSize={minSize}
    snapOffset={snapOffset}
    onDragEnd={onDragEnd}
  >
    {children}
  </SplitView>
);

export default Split;
