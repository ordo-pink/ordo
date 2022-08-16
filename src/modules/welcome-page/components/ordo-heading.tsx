import React from "react";
import { SpringValue } from "react-spring";

import { ToggleHeading } from "@modules/welcome-page/components/toggle-heading";
import { FoldVoid, fromBoolean } from "@utils/either";
// @ts-ignore
import Logo from "./ordo.svg";

export const OrdoHeading: React.FC<{ opacity: SpringValue<number>; toggle: boolean }> = ({ opacity, toggle }) => {
  const [output, setOutput] = React.useState<[number, number]>([1, 0]);
  const [range, setRange] = React.useState<[number, number]>([1.0, 0.0]);

  React.useEffect(
    () =>
      fromBoolean(toggle)
        .bimap(
          () => setOutput([1, 0]),
          () => setOutput([0, 1]),
        )
        .bimap(
          () => setRange([1.0, 0.0]),
          () => setRange([0.0, 1.0]),
        )
        .fold(...FoldVoid),
    [toggle],
  );

  return (
    <ToggleHeading range={range} output={output} opacity={opacity}>
      <Logo width={250} fill="transparent" />
    </ToggleHeading>
  );
};
