import type { Core } from "../core/core.types"
import type { Data } from "./data.types"
import { core } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"
import { data_mixins } from "./data.mixins"

export const data: Core.Impl<Data.Interface> = core.mix(
	core_mixins.identifiable,
	core_mixins.timestampable.with_updates,
	core_mixins.authored.with_updates,
	core_mixins.named,
	core_mixins.extendable,
	data_mixins.childish,
	data_mixins.contentful,
	data_mixins.creatable,
	data_mixins.linkable,
	data_mixins.taggable,
	data_mixins.persistable,
	data_mixins.accessible,
	data_mixins.serializable,
)
