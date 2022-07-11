import { AppDispatch, useAppDispatch } from "@core/state/store";
import React from "react";

interface Props {
	children?: React.ReactNode;
	dispatch: AppDispatch;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);

		this.props.dispatch({
			type: "@editor/close-tab",
			payload: null,
		});

		this.props.dispatch({
			type: "@activity-bar/select",
			payload: "WelcomePage",
		});

		this.props.dispatch({
			type: "@notifications/add",
			payload: {
				type: "error",
				title: error.name,
				content: error.message,
			},
		});

		this.props.dispatch({
			type: "@app/reload-window",
		});
	}

	public render() {
		if (this.state.hasError) {
			return <div>Something went wrong</div>;
		}

		return this.props.children;
	}
}

function componentWithHookAppDispatch(Component: any) {
	return function WrappedComponent(props: any) {
		const dispatch = useAppDispatch();
		return <Component {...props} dispatch={dispatch} />;
	};
}

export default componentWithHookAppDispatch(ErrorBoundary);
