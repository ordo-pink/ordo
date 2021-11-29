import * as React from "react"

type ConditionalProps = {
	when: boolean
}

export const Conditional: React.FC<ConditionalProps> = ({ when, children }) => {
	const [OnTrue, OnFalse] = Array.isArray(children) ? children : [children, ""]

	return when ? OnTrue : OnFalse
}
