import ActivityBar from "../components/activity-bar/activity-bar.tsx"

export default function App() {
	return (
		<div class="flex">
			<ActivityBar activities={[{ name: "file-explorer", version: "0.1.0", background: false }]} />
			<div>Hello</div>
		</div>
	)
}
