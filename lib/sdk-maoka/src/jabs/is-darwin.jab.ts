import type { Maoka } from "@ordo-pink/maoka"

export const is_darwin_jab: Maoka.Jab<boolean> = () => navigator.appVersion.indexOf("Mac") !== -1
