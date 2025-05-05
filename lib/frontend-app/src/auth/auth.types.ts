export namespace Auth {
	export type State = {
		user?: Ordo.User.Current.Instance
		code_requested?: boolean
		code_being_verified?: boolean
	}
}
