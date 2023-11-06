import { useState } from "react"
import { Button } from "./button"
import { EmailInput } from "./input"
import { Callout } from "./callout"

type P = { wide?: boolean; webHost: string; subsHost: string }
export default function BetaInvitation({ wide, webHost, subsHost }: P) {
	const [email, setEmail] = useState("")
	const [errors, setErrors] = useState<string[]>([])
	const isButtonDisabled = !email || errors.length > 0
	const bannerOpacity = errors.length > 0 ? "opacity-100" : "opacity-0"

	return (
		<div className="w-full space-y-4 px-8 py-4 bg-gradient-to-br max-w-2xl from-sky-200/80 dark:from-sky-950 via-indigo-200/80 dark:via-indigo-950 to-indigo-200/80 dark:to-indigo-950 rounded-lg shadow-lg">
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
						Бета-тестирование <strong>ORDO</strong> вот-вот начнётся!
					</p>
				</div>

				<div className="flex flex-col space-y-4">
					<EmailInput
						onInput={e =>
							e.fork(setErrors, v => {
								setEmail(v)
								setErrors([])
							})
						}
					/>
					<Button
						disabled={isButtonDisabled}
						onClick={async e => {
							e.preventDefault()

							if (isButtonDisabled) return

							await fetch(`${subsHost}/request-subscription`, {
								credentials: "include",
								headers: { "content-type": "application/json;charset=UTF-8" },
								body: JSON.stringify({ email }),
								method: "POST",
							})
								.then(res => res.json())
								.then(res => {})
						}}
					>
						Участвовать
					</Button>
				</div>
			</div>
			<p className="text-xs text-center">
				Нажимая на кнопку <b>"Участвовать"</b>, вы соглашаетесь с нашей{" "}
				<a href={`${webHost}/privacy-policy`}>политикой конфиденциальности</a>.
			</p>

			<div
				className={`w-full max-w-xs fixed bottom-4 transition-opacity duration-300 right-4 ${bannerOpacity}`}
			>
				<Callout type="error">{errors[0]}</Callout>
			</div>
		</div>
	)
}
