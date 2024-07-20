import { BsArrowsMove, BsCode, BsLock, BsSafe } from "react-icons/bs"

import ScreenshotCarousel from "../components/screenshot-carousel.component"

type P = { static_host: string }
export default function CorePrinciples({ static_host }: P) {
	return (
		<section
			id="core-principles"
			className="bg-gradient-to-br from-violet-200 via-neutral-200  to-neutral-200 shadow-2xl shadow-purple-950 dark:from-neutral-900 dark:via-stone-900 dark:to-stone-900 dark:shadow-purple-200"
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
						<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7">
									<div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-gradient-to-b from-rose-700 to-pink-600 shadow-md">
										<BsLock className="size-6 text-white" />
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
									<div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-gradient-to-b from-rose-700 to-pink-600 shadow-md">
										<BsSafe className="size-6 text-white" />
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
									<div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-gradient-to-b from-rose-700 to-pink-600 shadow-md">
										<BsCode className="size-6 text-white" />
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
									<div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-gradient-to-b from-rose-700 to-pink-600 shadow-md">
										<BsArrowsMove className="size-6 text-white" />
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

				<div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-base font-semibold leading-7 text-rose-700">Что умеет Ordo.pink</h2>
						<h3 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
							Фичули и скриншотики
						</h3>
					</div>

					<ScreenshotCarousel static_host={static_host} />
				</div>
			</div>
		</section>
	)
}