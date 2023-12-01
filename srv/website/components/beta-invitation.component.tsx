import { Button } from "./button"

type P = { wide?: boolean; webHost: string }
export default function BetaInvitation({ wide, webHost }: P) {
	return (
		<div className="w-full space-y-8 px-8 py-4 bg-gradient-to-br max-w-2xl from-sky-200/80 dark:from-sky-950 via-indigo-200/80 dark:via-indigo-950 to-indigo-200/80 dark:to-indigo-950 rounded-lg shadow-lg">
			<div
				className={
					wide
						? "flex flex-col space-y-8 w-full justify-between md:flex-row md:space-y-0"
						: "flex flex-col space-y-8"
				}
			>
				<div>
					<h3 className="text-2xl font-bold">
						<span className="text-purple-600 dark:text-orange-400">pub</span>{" "}
						<span className="text-purple-600 dark:text-orange-400">fn</span>{" "}
						<span className="text-neutral-700 dark:text-white">teβt</span>
						<span className="text-orange-600 dark:text-purple-400">()</span>{" "}
						<span className="text-purple-600 dark:text-orange-400">&rarr;</span>
					</h3>
					<p className="center opacity-75 ml-4">
						Бета-тестирование <strong>ORDO</strong> началось!
					</p>
				</div>

				<div className="flex flex-col space-y-4">
					<div
						className={
							wide
								? "flex flex-col space-y-2 mt-2"
								: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between items-center"
						}
					>
						<Button
							onClick={async e => {
								e.preventDefault()

								window.location.href = "/sign-up"
							}}
						>
							Присоединиться
						</Button>

						<Button
							inverted
							onClick={async e => {
								e.preventDefault()

								window.location.href = "/sign-in"
							}}
						>
							Войти
						</Button>
					</div>
				</div>
			</div>
			<p className="text-xs text-center">
				Нажимая на кнопку <b>&quot;Присоединиться&quot;</b>, вы соглашаетесь с нашей{" "}
				<a href={`${webHost}/privacy-policy`}>политикой конфиденциальности</a>.
			</p>
		</div>
	)
}
