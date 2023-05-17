import { Subscription, UserDTO, UserID } from "@ordo-pink/common-types"

export class User {
  public static of(
    id: UserID,
    firstName = "",
    lastName = "",
    subscription = Subscription.FREE,
    driveSize = 50,
    maxUploadSize = 5,
  ) {
    return new User(id, firstName, lastName, subscription, driveSize, maxUploadSize)
  }

  public static from({
    id,
    firstName,
    lastName,
    subscription,
    driveSize,
    maxUploadSize,
  }: UserDTO): User {
    return User.of(id, firstName, lastName, subscription, driveSize, maxUploadSize)
  }

  #id: UserID
  #firstName: string
  #lastName: string
  #subscription: Subscription
  #driveSize: number
  #maxUploadSize: number

  protected constructor(
    id: UserID,
    firstName: string,
    lastName: string,
    subscription: Subscription,
    driveSize: number,
    maxUploadSize: number,
  ) {
    this.#id = id
    this.#firstName = firstName
    this.#lastName = lastName
    this.#subscription = subscription
    this.#driveSize = driveSize
    this.#maxUploadSize = maxUploadSize
  }

  public get id(): UserID {
    return this.#id
  }

  public get firstName(): string {
    return this.#firstName
  }

  public get lastName(): string {
    return this.#lastName
  }

  public get fullName(): string {
    return `${this.#firstName} ${this.#lastName}`
  }

  public get subscription(): Subscription {
    return this.#subscription
  }

  public get driveSize(): number {
    return this.#driveSize
  }

  public get maxUploadSize(): number {
    return this.#maxUploadSize
  }

  public get toDTO(): UserDTO {
    return {
      id: this.#id,
      firstName: this.#firstName,
      lastName: this.#lastName,
      subscription: this.#subscription,
      driveSize: this.#driveSize,
      maxUploadSize: this.#maxUploadSize,
    }
  }
}
