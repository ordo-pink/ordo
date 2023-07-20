import { Head } from "$fresh/runtime.ts"
import { AppProps } from "$fresh/src/server/types.ts"

export default function App({ Component }: AppProps) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>

				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="crossorigin"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
					rel="stylesheet"
				/>
				<link
					rel="icon"
					type="image/png"
					href="/favicon.ico"
				/>
				<link
					rel="stylesheet"
					href="/main.css"
				/>
			</Head>

			<Component />
		</>
	)
}
