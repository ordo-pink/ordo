import { Switch } from "@ordo-pink/switch"
import { THeadingViewProps } from "./heading.types"

export const HeadingView = ({ level, className, children }: THeadingViewProps) =>
	Switch.of(level)
		.case("1", () => <h1 className={className}>{children}</h1>)
		.case("2", () => <h2 className={className}>{children}</h2>)
		.case("3", () => <h3 className={className}>{children}</h3>)
		.case("4", () => <h4 className={className}>{children}</h4>)
		.case("5", () => <h5 className={className}>{children}</h5>)
		.default(() => <div>{children}</div>)
