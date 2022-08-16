import React from "react";
import { config, useTransition } from "react-spring";
import { OrdoHeading } from "@modules/welcome-page/components/ordo-heading";

export const Logo: React.FC = () => {
  const [toggle, set] = React.useState<boolean>(false);

  const transitions = useTransition(toggle, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 200,
    config: config.molasses,
  });

  const handleClick = () => set(!toggle);

  return (
    <div className="welcome-page_title-container" onClick={handleClick}>
      {transitions(({ opacity }, toggleValue) => (
        <OrdoHeading opacity={opacity} toggle={toggleValue} />
      ))}
    </div>
  );
};
