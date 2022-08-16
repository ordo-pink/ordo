import { Switch } from "or-else";
import React from "react";

export const HeadingWrapper =
  (level: number): React.FC =>
  ({ children }) => {
    return Switch.of(level)
      .case(1, <h1 className="inline text-4xl">{children}</h1>)
      .case(2, <h2 className="inline text-3xl">{children}</h2>)
      .case(3, <h3 className="inline text-2xl">{children}</h3>)
      .case(4, <h4 className="inline text-xl">{children}</h4>)
      .case(5, <h5 className="inline text-lg">{children}</h5>)
      .default(<p>{children}</p>);
  };
