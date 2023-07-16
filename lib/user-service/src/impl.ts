import { Nullable } from "#lib/tau/mod.ts"
import { compare, genSalt, hash } from "#x/bcrypt@v0.4.1/mod.ts"
import { InternalUser, PublicUser, User, UserDriver } from "./types.ts"

export type UserServiceOptions = {
	saltRounds: number
}

export class UserService {
	#driver: UserDriver
	#salt: string

	public static async of(driver: UserDriver, options: UserServiceOptions) {
		const salt = await genSalt(options.saltRounds)

		return new UserService(driver, salt)
	}

	protected constructor(driver: UserDriver, salt: string) {
		this.#driver = driver
		this.#salt = salt
	}

	public async createUser(email: string, password: string): Promise<User> {
		const id = crypto.randomUUID()
		const pwd = await hash(password, this.#salt)

		const user = await this.#driver.create({
			id,
			email,
			password: pwd,
			emailConfirmed: false,
			createdAt: new Date(Date.now()),
		})

		return this.serialize(user)
	}

	public async updateUserPassword(
		user: User,
		oldPassword: string,
		newPassword: string
	): Promise<Nullable<User>> {
		const pwd = await hash(newPassword, this.#salt)

		const result = await this.#driver.update(user.id, {
			...user,
			password: pwd,
		})

		return result ? this.serialize(result) : null
	}

	public async update(
		id: string,
		user: Partial<User>
	): Promise<Nullable<User>> {
		const result = await this.#driver.update(id, user)

		return result ? this.serialize(result) : null
	}

	public async getByEmail(email: string): Promise<Nullable<User>> {
		const user = await this.#driver.getByEmail(email)

		return user ? this.serialize(user) : null
	}

	public async getUserInfo(email: string): Promise<Nullable<PublicUser>> {
		const user = await this.#driver.getByEmail(email)

		return user ? this.serializePublic(user) : null
	}

	public async getById(id: string): Promise<Nullable<User>> {
		const user = await this.#driver.getById(id)

		return user ? this.serialize(user) : null
	}

	public async comparePassword(
		email: string,
		password: string
	): Promise<boolean> {
		const user = await this.#driver.getByEmail(email)

		if (!user) return false

		return compare(password, user.password)
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
			email: "***", // TODO: obfuscate email
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
		}
	}
}
