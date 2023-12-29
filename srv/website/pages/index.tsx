// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import BetaInvitation from "components/beta-invitation.component"
import { Centered } from "../components/centered"
import IndexHeroSection from "../components/index-hero"
import { BsArrowsMove, BsCode, BsLock, BsSafe } from "react-icons/bs"
import Footer from "components/footer.component"
import ScreenshotCarousel from "components/screenshot-carousel.component"
import Head from "next/head"

const webHost = process.env.NEXT_PUBLIC_ORDO_WEB_HOST!
const staticHost = process.env.NEXT_PUBLIC_ORDO_STATIC_HOST!

export default function Home() {
	return (
		<main className="scroll-smooth">
			<Head>
				<title>Единое пространство для документов, файлов и проектов | Ordo</title>
				<link rel="icon" href={`${process.env.NEXT_PUBLIC_ORDO_STATIC_HOST}/favicon.ico`} />
				<meta name="title" content="Единое пространство для документов, файлов и проектов | Ordo" />

				<meta
					name="description"
					content="Новый инструмент, объединяющий все ваши повседневные рабочие приложения в одно. Это универсальное рабочее пространство для вас и вашей команды."
				/>

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://ordo.pink" />
				<meta
					property="og:title"
					content="Единое пространство для документов, файлов и проектов | Ordo"
				/>
				<meta
					property="og:description"
					content="Новый инструмент, объединяющий все ваши повседневные рабочие приложения в одно. Это универсальное рабочее пространство для вас и вашей команды."
				/>
				<meta property="og:image" content={`${staticHost}/og.png`} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://ordo.pink" />
				<meta
					property="twitter:title"
					content="Единое пространство для документов, файлов и проектов | Ordo"
				/>
				<meta
					property="twitter:description"
					content="Новый инструмент, объединяющий все ваши повседневные рабочие приложения в одно. Это универсальное рабочее пространство для вас и вашей команды."
				/>
				<meta property="twitter:image" content={`${staticHost}/og.png`} />
			</Head>

			<IndexHeroSection staticHost={staticHost} />

			<section
				id="core-principles"
				className="shadow-2xl shadow-purple-950 dark:shadow-purple-200  bg-gradient-to-br from-violet-200 via-neutral-200 dark:via-stone-900 dark:from-neutral-900 to-neutral-200 dark:to-stone-900"
			>
				<div className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl lg:text-center">
							<h2 className="text-base font-semibold leading-7 text-rose-700">Основные принципы</h2>
							<h3 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
								Безопасность, прозрачность и гибкость
							</h3>
							<p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400"></p>
						</div>
						<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
							<dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
								<div className="relative pl-16">
									<dt className="text-base font-semibold leading-7">
										<div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b shadow-md from-rose-700 to-pink-600">
											<BsLock className="w-6 h-6 text-white" />
										</div>
										Шифрование на всех уровнях
									</dt>
									<dd className="mt-2 text-base leading-7 text-neutral-600 dark:text-neutral-400">
										Ваши данные всегда передаются и хранятся в зашифрованном виде для обеспечения
										максимальной защиты.
									</dd>
								</div>
								<div className="relative pl-16">
									<dt className="text-base font-semibold leading-7">
										<div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b shadow-md from-rose-700 to-pink-600">
											<BsSafe className="w-6 h-6 text-white" />
										</div>
										Ваши данные принадлежат только вам
									</dt>
									<dd className="mt-2 text-base leading-7 text-neutral-600 dark:text-neutral-400">
										Вы можете самостоятельно решать, хранить ли данные в Ordo Cloud, на собственном
										сервере, или в стороннем облачном сервисе - все ваши данные будут доступны на
										любом устройстве, привязанном к текущему аккаунту. И даже оффлайн.
									</dd>
								</div>
								<div className="relative pl-16">
									<dt className="text-base font-semibold leading-7">
										<div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b shadow-md from-rose-700 to-pink-600">
											<BsCode className="w-6 h-6 text-white" />
										</div>
										Открытый исходный код
									</dt>
									<dd className="mt-2 text-base leading-7 text-neutral-600 dark:text-neutral-400">
										Исходный код Ordo является на 100% открытым. Таким образом мы гарантируем, что
										наши слова &ndash; это не просто слова.
									</dd>
								</div>
								<div className="relative pl-16">
									<dt className="text-base font-semibold leading-7">
										<div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b shadow-md from-rose-700 to-pink-600">
											<BsArrowsMove className="w-6 h-6 text-white" />
										</div>
										Расширяемость
									</dt>
									<dd className="mt-2 text-base leading-7 text-neutral-600 dark:text-neutral-400">
										Возможности Ordo можно расширить с помощью Extension Store, а также создавать
										модули расширений под ваши нужды.
									</dd>
								</div>
							</dl>
						</div>
					</div>

					<div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12">
						<div className="text-center">
							<h2 className="text-base font-semibold leading-7 text-rose-700">
								Что умеет Ordo.pink
							</h2>
							<h3 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
								Фичули и скриншотики
							</h3>
						</div>

						<ScreenshotCarousel staticHost={staticHost} />
					</div>
				</div>
			</section>

			<section id="request-public-beta-access" className="relative">
				<div className="custom-shape-divider-top-1698669729">
					<svg
						data-name="Layer 1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
					>
						<path
							d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
							opacity=".25"
							className="shape-fill"
						></path>
						<path
							d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
							opacity=".5"
							className="shape-fill"
						></path>
						<path
							d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
							className="shape-fill"
						></path>
					</svg>
				</div>
				<Centered centerX>
					<div className="w-full bg-gradient-to-br from-sky-700 via-indigo-700 to-indigo-700">
						<div className="w-full pt-32 backdrop-saturate-50 px-8 pt-32f">
							<div className="w-full flex backdrop-saturate-50">
								<div className="w-full flex justify-center">
									<BetaInvitation wide />
								</div>
							</div>

							<div className="mt-24 pb-4">
								<Footer />
							</div>
						</div>
					</div>
				</Centered>
			</section>
		</main>
	)
}
