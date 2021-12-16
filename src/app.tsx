import React from "react";
import Scrollbars from "react-custom-scrollbars";

import { Editor } from "./editor/editor";

export const App: React.FC = () => {
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
							<Editor />
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
						paddingBottom: "1.5em",
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
				<div></div>
				<div>test</div>
			</div>
		</div>
	);
};
