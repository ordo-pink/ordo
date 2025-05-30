import type { Core } from "./sdk-core.types"

export const mix: Core.Mix = (...mixins) => ({
	...mixins.reduce((acc, mixin) => ({ ...acc, ...mixin.static }), {} as any),
	validations: {
		...mixins.reduce((acc, mixin) => ({ ...acc, ...mixin.validations }), {}),
	},
})
