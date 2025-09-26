import type { I18n } from "@ordo-pink/oss-i18n"

declare global {
	interface cmd {
		i18n: {
			add_translations: {
				args: {
					locale: I18n.ISO_639_1_Locale
					values: Partial<Record<I18n.DefinitionToTranslationKeys<OrdoClient.Translations.Keys>, string>>
				}
			}
			remove_translations: { args: OrdoClient.Translations.Key[] }
			set_locale: { args: I18n.ISO_639_1_Locale }
		}
	}

	namespace OrdoClient.Translations {
		export type Keys = Pick<t, keyof t>
		export type Key = I18n.DefinitionToTranslationKeys<Keys>
		export type Values = Record<I18n.DefinitionToTranslationKeys<Keys>, string>

		type HasPrefix<T extends string, P extends string> = T extends `${P}${string}` ? T : never

		export type PickValues<$Prefix extends string> = {
			[_Key in keyof Values as HasPrefix<_Key, $Prefix>]: Values[_Key]
		}
	}
}
