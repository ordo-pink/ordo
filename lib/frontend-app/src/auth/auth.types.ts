export namespace Auth {
	export type State = {
		user?: Ordo.User.Current.Instance
		email: string
		code: string
	}
}
