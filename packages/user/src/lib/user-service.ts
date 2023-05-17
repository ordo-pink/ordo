import {
  OrdoError,
  OrdoErrorCode,
  Subscription,
  UserDTO,
  UserDriver,
  UserID,
} from "@ordo-pink/common-types"
import { User } from "./user"

export class UserService {
  public static of(userDriver: UserDriver): UserService {
    return new UserService(userDriver)
  }

  #userDriver: UserDriver

  protected constructor(userDriver: UserDriver) {
    this.#userDriver = userDriver
  }

  public async exists(id: UserID): Promise<boolean> {
    return await this.#userDriver.exists(`/${id}/`)
  }

  public async create(
    id: UserID,
    firstName?: string,
    lastName?: string,
    subscription?: Subscription,
  ): Promise<UserDTO> {
    const isExistingUser = await this.exists(id)

    if (isExistingUser) throw OrdoError.of(OrdoErrorCode.USER_ALREADY_EXISTS)

    const user = await this.#userDriver.create({ id, firstName, lastName, subscription })

    return user
  }

  public async get(id: UserID): Promise<UserDTO> {
    const isExistingUser = await this.exists(id)

    if (!isExistingUser) throw OrdoError.of(OrdoErrorCode.USER_NOT_FOUND)

    return this.#userDriver.get(id) as Promise<UserDTO>
  }

  public async update(id: UserID, user: User): Promise<UserDTO> {
    const identifiedUser = await this.get(id)

    if (!identifiedUser) throw OrdoError.of(OrdoErrorCode.USER_NOT_FOUND)

    const updatedUser = User.from({
      ...user.toDTO,
      id: identifiedUser.id,
      maxUploadSize: identifiedUser.maxUploadSize,
      driveSize: identifiedUser.driveSize,
      subscription: identifiedUser.subscription,
    })

    return this.#userDriver.update(id, updatedUser) as Promise<UserDTO>
  }

  public async remove(id: UserID): Promise<UserDTO> {
    const identifiedUser = await this.get(id)

    if (!identifiedUser) throw OrdoError.of(OrdoErrorCode.USER_NOT_FOUND)

    await this.#userDriver.remove(id)

    return identifiedUser
  }
}
