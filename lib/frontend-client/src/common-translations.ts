import { TLogger } from "@ordo-pink/logger"

export const register_common_translations = (
	logger: TLogger,
	commands: Client.Commands.Commands,
) => {
	logger.debug("🟡 Registerring common translations...")

	commands.emit<cmd.application.add_translations>("application.add_translations", {
		lang: "en",
		prefix: "common",
		translations: EN_TRANSLATIONS,
	})

	commands.emit<cmd.application.add_translations>("application.add_translations", {
		lang: "ru",
		prefix: "common",
		translations: RU_TRANSLATIONS,
	})

	logger.debug("🟢 Registerred common translations.")
}

const EN_TRANSLATIONS: Record<keyof t.common, string> = {
	email: "Email",
	handle: "Handle",
	password: "Password",
	privacy_policy: "Privacy Policy",
	repeat_password: "Repeat Password",
	twitter_url: "https://x.com/ordo_pink",
	messenger_support_url: "https://t.me/ordo_pink",
	email_support: "support@ordo.pink",
	license: "License",
	contact_us: "Contact Us",
}

const RU_TRANSLATIONS: Record<keyof t.common, string> = {
	email: "Email",
	handle: "Имя пользователя",
	password: "Пароль",
	privacy_policy: "Политика конфиденциальности",
	repeat_password: "И ещё раз пароль",
	twitter_url: "https://x.com/ordo_pink",
	messenger_support_url: "https://t.me/ordo_pink_ru",
	email_support: "support@ordo.pink",
	license: "Лицензия",
	contact_us: "Написать нам",
}
