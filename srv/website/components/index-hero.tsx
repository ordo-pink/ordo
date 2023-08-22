// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client"

import { useLayoutEffect } from "react"
import { Button } from "./button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function IndexHeroSection() {
	const router = useRouter()

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

	const handleJoinClick = () => router.push("/sign-in")

	return (
		<section className="hero-section overflow-hidden">
			<div className="hero-layers h-screen will-change-transform transition-transform">
				<div className="hero-layer-1 absolute inset-[-40vw] bg-cover bg-center flex items-center justify-center scale-125 pointer-events-none" />
				<div className="hero-layer-2 absolute inset-0 bg-cover bg-center flex items-center justify-center opacity-20 pointer-events-none" />
				<div className="hero-layer-3 absolute inset-0 bg-cover bg-center flex items-center justify-center opacity-30 pointer-events-none" />
				<div className="hero-layer-4 absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center">
					<h1 className="text-center text-2xl uppercase tracking-tight">
						Bring your thoughts to
						<span className="block text-8xl font-black first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent">
							ORDO
						</span>
					</h1>
					<p className="center opacity-50 mt-4">The next gen data strorage</p>
					<div className="mt-12 flex space-x-8">
						{/* TODO: Transparent button */}
						<Button onClick={handleJoinClick}>Join</Button>
						<Link href="#about">Learn more</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
