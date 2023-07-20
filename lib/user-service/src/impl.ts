import { Nullable } from "#lib/tau/mod.ts"
import { compare, genSalt, hash } from "#x/bcrypt@v0.4.1/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { InternalUser, PublicUser, User, UserAdapter } from "./types.ts"

export type UserServiceOptions = {
	saltRounds: number
}

export class UserService {
	#driver: UserAdapter
	#salt: string

	public static async of(driver: UserAdapter, options: UserServiceOptions) {
		const salt = await genSalt(options.saltRounds)

		return new UserService(driver, salt)
	}

	protected constructor(driver: UserAdapter, salt: string) {
		this.#driver = driver
		this.#salt = salt
	}

	public createUser(email: string, password: string) {
		return Oath.from(() => hash(password, this.#salt))
			.chain(password =>
				this.#driver.create({
					id: crypto.randomUUID(),
					email,
					password,
					emailConfirmed: false,
					createdAt: new Date(Date.now()),
				})
			)
			.map(this.serialize)
	}

	public updateUserPassword(user: User, oldPassword: string, newPassword: string) {
		return this.#driver.getById(user.id).chain(oldUser =>
			Oath.from(() => compare(oldPassword, oldUser.password))
				.chain(valid =>
					Oath.fromBoolean(
						() => valid,
						() => user,
						() => "Invalid password"
					)
				)
				.chain(user =>
					Oath.from(() => hash(newPassword, this.#salt)).map(
						password =>
							({
								...user,
								password,
							} as InternalUser)
					)
				)
				.chain(user => this.#driver.update(oldUser.id, user).rejectedMap(() => "User not found"))
				.map(user => this.serialize(user))
		)
	}

	public update(id: string, user: Partial<User>) {
		return this.#driver.update(id, user).map(user => this.serialize(user))
	}

	public getByEmail(email: string) {
		return this.#driver.getByEmail(email).map(user => this.serialize(user))
	}

	public getUserInfo(email: string) {
		return this.#driver.getByEmail(email).map(user => this.serializePublic(user))
	}

	public getById(id: string) {
		return this.#driver.getById(id).map(user => this.serialize(user))
	}

	public comparePassword(email: string, password: string) {
		return this.#driver
			.getByEmail(email)
			.chain(user => Oath.from(() => compare(password, user.password)))
			.chain(x =>
				Oath.fromBoolean(
					() => x,
					() => x,
					() => x
				)
			)
	}

	private serialize(user: InternalUser): User {
		return {
			createdAt: user.createdAt,
			email: user.email,
			emailConfirmed: user.emailConfirmed,
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
		}
	}

	private serializePublic(user: InternalUser): PublicUser {
		return {
			createdAt: user.createdAt,
			email: user.email, // TODO: obfuscate email
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
		}
	}
}
