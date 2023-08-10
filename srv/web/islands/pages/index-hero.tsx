import { useLayoutEffect } from "preact/hooks"
import { Button } from "../../components/button.tsx"

export default function IndexHeroSection() {
	useLayoutEffect(() => {
		const listener = (event: MouseEvent) => {
			Object.assign(document.documentElement, {
				style: `
        --move-x: ${(event.clientX - window.innerWidth / 2) * -0.005}deg;
        --move-y: ${(event.clientY - window.innerHeight / 2) * -0.01}deg;
        `,
			})
		}

		document.addEventListener("mousemove", listener)

		return () => document.removeEventListener("mousemove", listener)
	}, [])

	const handleJoinClick = () => void (window.location.href = "/sign-up")

	return (
		<section
			class="overflow-hidden"
			style="perspective: 1000px;"
		>
			<div
				class="h-screen will-change-transform transition-transform"
				style="transform-style: preserve-3d; transform: rotateX(var(--move-y)) rotateY(var(--move-x)); transition: var(--transition);"
			>
				<div
					class="absolute inset-[-20vw] bg-cover bg-center flex items-center justify-center scale-125 pointer-events-none"
					style="background-image: url(index-hero-layer-0.png); transform: translateZ(-55px);"
				/>
				<div
					class="absolute inset-0 bg-cover bg-center flex items-center justify-center opacity-20 pointer-events-none"
					style="background-image: url(index-hero-layer-1.png); transform: translateZ(100px);"
				/>

				<div
					class="absolute inset-0 bg-cover bg-center flex items-center justify-center opacity-30 pointer-events-none"
					style="background-image: url(index-hero-layer-2.png); transform: translateZ(500px) "
				/>

				<div
					class="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center"
					style="transform: translateZ(250px); font-size: calc(var(--index) * 0.6)"
				>
					<h1 class="text-center uppercase tracking-tight">
						Bring your thoughts to
						<span class="block text-7xl tracking-tight font-black first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent">
							ORDO
						</span>
					</h1>
					<p class="center opacity-50 mt-4">The next gen data strorage</p>
					<div class="mt-8">
						{/* TODO: Transparent button */}
						<Button onClick={handleJoinClick}>Join</Button>
					</div>
				</div>
			</div>
		</section>
	)
}
