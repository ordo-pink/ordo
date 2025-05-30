import type { Core } from "../../sdk-core.types"
import type { Creatable } from "../../mixins/creatable.mixin"
import type { User } from "../user.types"
import { current_user } from "../user.impl"

export namespace creatable {
	/** Implements {@link Creatable.Interface} for {@link User.Current.Interface}. */
	export const mixin: Core.Mixin<Creatable.Interface<User.Current.CreateParams, User.Current.Interface>> = {
		instance: () => ({}),
		static: {
			new: (email, handle, subscription, name, fns, fn_limit, file_limit, file_size_limit) => {
				const id = current_user.create_id()
				const created_at = current_user.create_timestamp()
				const sessions = current_user.get_default_sessions()

				return current_user.from_dto([
					id,
					created_at,
					handle ?? current_user.create_handle(email, id),
					subscription ?? current_user.get_default_subscription(),
					name ?? current_user.get_default_name(),
					email,
					fns ?? current_user.get_default_fns(),
					file_limit ?? current_user.get_default_file_limit(),
					fn_limit ?? current_user.get_default_fn_limit(),
					file_size_limit ?? current_user.get_default_file_size_limit(),
					sessions,
				])
			},
		},
		validations: {},
	}
}
