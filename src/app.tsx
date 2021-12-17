import React from "react";
import Scrollbars from "react-custom-scrollbars";

import { Editor } from "./editor/editor";

interface StatusBarItem {
	id: string;
	value: string;
	onClick: () => void;
}

export const App: React.FC = () => {
	// TODO: Move to redux
	const [status, setStatus] = React.useState<StatusBarItem[]>([]);

	const addStatus = (item: StatusBarItem) => setStatus([...status, item]);
	const removeStatus = (id: string) =>
		setStatus(
			[...status].splice(
				status.findIndex((i) => i.id === id),
				1,
			),
		);
	const updateStatus = (item: StatusBarItem) => {
		const oldItem = status.findIndex((i) => i.id === item.id);
		const copy = [...status];
		copy.splice(oldItem, 1, item);
		setStatus(copy);
	};

	return (
		<div>
			<div style={{ display: "flex", flexDirection: "row", height: "calc(100vh - 1.3em)" }}>
				<div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
					<div
						style={{
							background: "#ccc",
							display: "flex",
							fontSize: "0.9em",
							alignItems: "center",
						}}
					>
						<div
							style={{
								background: "#eee",
								borderRight: "1px solid #ddd",
								padding: "0.5em 2em",
								cursor: "pointer",
							}}
						>
							Test.md
						</div>
					</div>
					<div
						style={{
							background: "#eee",
							flexGrow: 1,
							paddingTop: "1em",
						}}
					>
						<Scrollbars>
							<Editor addStatus={addStatus} updateStatus={updateStatus} removeStatus={removeStatus} />
						</Scrollbars>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "0.5em",
						width: "2.5em",
						borderLeft: "1px solid #ccc",
						background: "#ddd",
					}}
				>
					<div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
						<div style={{ fontSize: "2em", cursor: "pointer", marginBottom: "0.2em" }}>📄</div>
						<div style={{ fontSize: "2em", cursor: "pointer", marginBottom: "0.2em" }}>🌲</div>
					</div>
					<div style={{ fontSize: "2em", cursor: "pointer", marginBottom: "0.2em" }}>⚙️</div>
				</div>
			</div>
			<div
				style={{
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					height: "1.3em",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: "0.75em",
					padding: "0.2em 1em",
					background: "#ddd",
					borderTop: "1px solid #ccc",
				}}
			>
				<div>
					{status.map((item) => (
						<span key={item.id} style={{ marginRight: "1em" }} onClick={item.onClick || (() => null)}>
							{item.value}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};
