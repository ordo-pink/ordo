import * as React from "react"

export const Conditional: React.FC<{ when: boolean }> = ({ when, children }) => {
	const [OnTrue, OnFalse] = Array.isArray(children) ? children : [children, ""]

	return when ? OnTrue : OnFalse
}
