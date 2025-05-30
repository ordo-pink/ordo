import type { Core } from "../../sdk-core.types"
import type { Transferable } from "../../mixins/transferable.mixin"
import type { User } from "../user.types"
import { authenticated } from "./authenticated.mixin"
import { identifiable } from "../../mixins/identifiable.mixin"
import { is_array } from "../../validations.impl"
import { named } from "../../mixins/named.mixin"
import { receptive } from "./receptive.mixin"
import { referable } from "./referable.mixin"
import { session } from "../../session/session.impl"
import { space_limited } from "./space-limited.mixin"
import { subscribed } from "./subscribed.mixin"
import { timestampable } from "../../mixins/timestampable.mixin"
import { ui_extendable } from "./ui-extendable.mixin"

export namespace user_transferable {
	export const public_mixin: Core.Mixin<Transferable.Interface<User.Public.DTO, User.Public.DataInterface>> = {
		instance: plain => ({
			to_dto: () => [plain.id, plain.created_at.getMilliseconds(), plain.handle, plain.subscription, plain.name],
		}),
		static: {
			from_dto: (...dto) => {
				const plain: User.Public.Interface["Plain"] = {
					created_at: new Date(dto[1]),
					handle: dto[2],
					id: dto[0],
					name: dto[4],
					subscription: dto[3],
				}

				return {
					...identifiable.instance(plain),
					...named.mixin.instance(plain),
					...referable.mixin.instance(plain),
					...subscribed.mixin.instance(plain),
					...timestampable.without_updates.instance(plain),
					...user_transferable.public_mixin.instance(plain),
				}
			},
		},
		validations: {
			is_dto: (x): x is User.Public.DTO => {
				if (!is_array(x)) return false

				const dto = x as User.Public.DTO

				return (
					identifiable.validations.is_id(dto[0]) &&
					timestampable.without_updates.validations.is_timestamp(dto[1]) &&
					referable.mixin.validations.is_handle(dto[2]) &&
					subscribed.mixin.validations.is_subscription(dto[3]) &&
					named.mixin.validations.is_name(dto[4])
				)
			},
		},
	}

	export const current_mixin: Core.Mixin<Transferable.Interface<User.Current.DTO, User.Current.DataInterface>> = {
		instance: plain => ({
			to_dto: () => [
				plain.id,
				plain.created_at.getMilliseconds(),
				plain.handle,
				plain.subscription,
				plain.name,
				plain.email,
				plain.installed_fns,
				plain.fn_limit,
				plain.file_limit,
				plain.file_size_limit,
				plain.sessions.map(s => s.to_dto()),
			],
		}),
		static: {
			from_dto: (...dto) => {
				const plain: User.Current.Interface["Plain"] = {
					created_at: new Date(dto[1]),
					email: dto[5],
					file_limit: dto[8],
					file_size_limit: dto[9],
					fn_limit: dto[7],
					handle: dto[2],
					id: dto[0],
					installed_fns: dto[6],
					name: dto[4],
					sessions: dto[10].map(s => session.from_dto(...s)),
					subscription: dto[3],
				}

				return {
					...identifiable.instance(plain),
					...named.mixin.instance(plain),
					...referable.mixin.instance(plain),
					...subscribed.mixin.instance(plain),
					...timestampable.without_updates.instance(plain),
					...receptive.mixin.instance(plain),
					...ui_extendable.mixin.instance(plain),
					...space_limited.mixin.instance(plain),
					...authenticated.mixin.instance(plain),
					...user_transferable.current_mixin.instance(plain),
				}
			},
		},
		validations: {
			is_dto: (x): x is User.Current.DTO => {
				if (!is_array(x)) return false

				const dto = x as User.Current.DTO

				return (
					identifiable.validations.is_id(dto[0]) &&
					timestampable.without_updates.validations.is_timestamp(dto[1]) &&
					referable.mixin.validations.is_handle(dto[2]) &&
					subscribed.mixin.validations.is_subscription(dto[3]) &&
					named.mixin.validations.is_name(dto[4]) &&
					receptive.mixin.validations.is_email(dto[5]) &&
					dto[6].every(ui_extendable.mixin.validations.is_fn) &&
					ui_extendable.mixin.validations.is_fn_limit(dto[7]) &&
					space_limited.mixin.validations.is_file_limit(dto[8]) &&
					space_limited.mixin.validations.is_file_size_limit(dto[9]) &&
					dto[10].every(authenticated.mixin.validations.is_session)
				)
			},
		},
	}
}
