// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react"

export default class ErrorBoundary extends Component<P, S> {
	constructor(props: PropsWithChildren<P>) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(): S {
		return { hasError: true }
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		this.props.logError(error, info)
	}

	render(): ReactNode | undefined {
		if (this.state.hasError) {
			return this.props.fallback
		}

		return this.props.children
	}
}

// --- Internal ---

type Logger = (error: Error, info: ErrorInfo) => void
type P = PropsWithChildren<{ fallback?: ReactNode; logError: Logger }>
type S = { hasError: boolean }
