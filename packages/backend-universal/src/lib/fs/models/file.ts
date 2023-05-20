import {
  FSID,
  FileDriver,
  IOrdoFile,
  IOrdoFileInitParams,
  IOrdoFileModel,
  MetadataDriver,
  OrdoDirectoryPath,
  OrdoError,
  OrdoErrorCode,
  OrdoFileExtension,
  OrdoFilePath,
  StatsDriver,
  UserID,
} from "@ordo-pink/common-types"
import { endsWithSlash, isValidPath } from "@ordo-pink/fs-entity"
import { equals } from "ramda"

const SIZE_ABBREVIATIONS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
const EMPTY_READABLE_SIZE = `0${SIZE_ABBREVIATIONS[0]}`

export class OrdoFile<CustomMetadata extends Record<string, unknown> = Record<string, unknown>> {
  public static of<CustomMetadata extends Record<string, unknown> = Record<string, unknown>>(
    path: OrdoFilePath,
    fsid: FSID,
    createdBy: UserID,
    updatedBy: UserID,
    size = 0,
    createdAt = new Date(Date.now()),
    updatedAt = new Date(Date.now()),
    metadata: CustomMetadata = {} as CustomMetadata,
    encryption: string | false = false,
  ) {
    if (!OrdoFile.isValidPath(path)) {
      throw OrdoError.of(OrdoErrorCode.INVALID_FILE_PATH)
    }

    return new OrdoFile(
      path,
      fsid,
      size,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
      metadata,
      encryption,
    )
  }

  public static from<CustomMetadata extends Record<string, unknown> = Record<string, unknown>>({
    path,
    fsid,
    size,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    encryption,
    ...metadata
  }: IOrdoFile<CustomMetadata>): OrdoFile<CustomMetadata> {
    return new OrdoFile(
      path,
      fsid,
      size,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
      metadata as unknown as CustomMetadata,
      encryption,
    )
  }

  public static isValidPath(path: string): path is OrdoFilePath {
    return typeof path === "string" && isValidPath(path) && !endsWithSlash(path)
  }

  public static isOrdoFile(x: unknown): x is IOrdoFile {
    const file = x as IOrdoFile

    return (
      Boolean(file) &&
      typeof file.path === "string" &&
      typeof file.fsid === "string" &&
      typeof file.size === "number" &&
      typeof file.createdBy === "string" &&
      typeof file.updatedBy === "string" &&
      (typeof file.encryption === "string" || file.encryption === false) &&
      file.createdAt instanceof Date &&
      file.updatedAt instanceof Date &&
      file.size >= 0 &&
      OrdoFile.isValidPath(file.path)
    )
  }

  #path: OrdoFilePath
  #fsid: FSID
  #size: number
  #createdAt: Date
  #updatedAt: Date
  #createdBy: UserID
  #updatedBy: UserID
  #metadata: CustomMetadata
  #encryption: string | false

  protected constructor(
    path: OrdoFilePath,
    fsid: FSID,
    size: number,
    createdAt: Date,
    updatedAt: Date,
    createdBy: UserID,
    updatedBy: UserID,
    metadata: CustomMetadata,
    encryption: string | false,
  ) {
    this.#path = path
    this.#fsid = fsid
    this.#size = size
    this.#createdAt = createdAt
    this.#updatedAt = updatedAt
    this.#createdBy = createdBy
    this.#updatedBy = updatedBy
    this.#metadata = metadata
    this.#encryption = encryption
  }

  public get path(): OrdoFilePath {
    return this.#path
  }

  public get fsid(): FSID {
    return this.#fsid
  }

  public get size(): number {
    return this.#size
  }

  public get createdAt(): Date {
    return this.#createdAt
  }

  public get updatedAt(): Date {
    return this.#updatedAt
  }

  public get createdBy(): UserID {
    return this.#createdBy
  }

  public get updatedBy(): UserID {
    return this.#updatedBy
  }

  public get encryption(): string | false {
    return this.#encryption
  }

  public get readableName(): string {
    const lastSeparatorPosition = this.#path.lastIndexOf("/") + 1
    const readableName = this.#path.slice(lastSeparatorPosition)

    return readableName.replace(this.extension, "")
  }

  public get extension(): OrdoFileExtension {
    const fileName = this.#path.split("/").reverse()[0] as string

    const lastDotPosition = fileName.lastIndexOf(".")

    if (!~lastDotPosition) {
      return ""
    }

    return fileName.substring(lastDotPosition) as OrdoFileExtension
  }

  public get readableSize(): string {
    const d = Math.floor(Math.log(this.#size) / Math.log(1024))
    const num = parseFloat((this.#size / Math.pow(1024, d)).toFixed(Math.max(0, 2)))

    return this.#size === 0 ? EMPTY_READABLE_SIZE : `${num}${SIZE_ABBREVIATIONS[d]}`
  }

  public get parentPath(): OrdoDirectoryPath {
    const lastSeparatorPosition = this.#path.lastIndexOf("/") + 1

    return this.#path.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  }

  public getMetadata<Key extends keyof CustomMetadata>(key: Key): CustomMetadata[Key] {
    return this.#metadata[key]
  }

  public setMetadata<Key extends keyof CustomMetadata>(key: Key, value: CustomMetadata[Key]) {
    this.#metadata[key] = value
  }

  public toJS(): IOrdoFile<CustomMetadata> {
    return {
      ...this.#metadata,
      path: this.#path,
      fsid: this.#fsid,
      size: this.#size,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      createdBy: this.#createdBy,
      updatedBy: this.#updatedBy,
      encryption: this.#encryption,
    }
  }
}

/**
 * OrdoFileModel provides access to Ordo files and their metadata.
 *
 * TODO: Partial updates for text files.
 * TODO: Fetching lists of files with given filters.
 */
export class OrdoFileModel<Content> implements IOrdoFileModel<Content> {
  /**
   * Constructs an OrdoFileModel.
   */
  public static of<Content>(
    fileDriver: FileDriver<Content>,
    metadataDriver: MetadataDriver,
    statsDriver: StatsDriver,
  ): OrdoFileModel<Content> {
    return new OrdoFileModel<Content>(fileDriver, metadataDriver, statsDriver)
  }

  /**
   * File driver is used for managing physical files.
   */
  #fileDriver: FileDriver<Content>

  /**
   * Metadata driver is used for managing file and directory metadata.
   */
  #metadataDriver: MetadataDriver

  /**
   * Stats driver is used for updating user statistics. It also provides audit
   * for team accounts.
   */
  #statsDriver: StatsDriver

  /**
   * @constructor
   */
  protected constructor(
    fileDriver: FileDriver<Content>,
    metadataDriver: MetadataDriver,
    statsDriver: StatsDriver,
  ) {
    this.#fileDriver = fileDriver
    this.#metadataDriver = metadataDriver
    this.#statsDriver = statsDriver
  }

  /**
   * Check if a file under given path exists. A file is considered existing if
   * there is a physical file, and metadata record associated with it.
   *
   * @throws if errors occur in drivers.
   *
   * @param {OrdoFilePath} path - path to the file.
   *
   * @returns {Promise<boolean>} - whether the file exists or not.
   */
  public async exists(path: OrdoFilePath): Promise<boolean> {
    const metadata = await this.#metadataDriver.readFile(path)

    if (!metadata) return false

    return this.#fileDriver.exists(metadata.fsid)
  }

  /**
   * Creates an OrdoFile as a physical empty file, and metadata associated with
   * it. If file content is provided, the created file will be updated with the
   * provided content. Assigns default file metadata properties.
   *
   * @throws if a file with given path already exists.
   * @throws if errors occur in drivers.
   *
   * @param {IOrdoFileInitParams} file - file metadata to be saved.
   * @param {UserID} userId - id of the user creating the file.
   * @param {Content} content - @optional content of the created file.
   *
   * @returns {Promise<IOrdoFile>} - metadata of the created file.
   */
  public async create(
    file: IOrdoFileInitParams,
    userId: UserID,
    content?: Content,
  ): Promise<IOrdoFile> {
    const isExistingFile = await this.exists(file.path)

    if (isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_ALREADY_EXISTS)

    const fsid = await this.#fileDriver.create(file.path)

    // Reassign metadata values that must not be changed
    file.fsid = fsid
    file.size = 0
    file.createdAt = new Date(Date.now())
    file.updatedAt = new Date(Date.now())
    file.createdBy = userId
    file.updatedBy = userId

    // Save content to the file if the content was provided
    if (content) {
      const size = (await this.#fileDriver.update(fsid, content)) as number
      file.size = size
    }

    const result = await this.#metadataDriver.createFile(file as IOrdoFile)

    // Update the stats
    this.#statsDriver.fileCreated(userId, result)

    return result
  }

  /**
   * Get metadata of the file under given path.
   *
   * @throws if a file with given path does not exist.
   * @throws if errors occur in drivers.
   *
   * @param {OrdoFilePath} path - path to the file.
   * @param {UserID} userId - id of the user fetching the file.
   *
   * @returns {Promise<IOrdoFile>} - metadata of the requested file.
   */
  public async get(path: OrdoFilePath, userId: UserID): Promise<IOrdoFile> {
    const isExistingFile = await this.exists(path)

    if (!isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

    const metadata = (await this.#metadataDriver.readFile(path)) as IOrdoFile

    this.#statsDriver.fileFetched(userId, metadata)

    return metadata
  }

  /**
   * Update metadata of a file under given path.
   *
   * @throws if a file does not exist under given path, and upsert is not true.
   * @throws if errors occur in drivers.
   *
   * @param {OrdoFilePath} path - path to the file.
   * @param {UserID} userId - id of the user updating the file.
   * @param {Content} content - content to be saved.
   * @param {boolean} upsert - @optional flag that allows creating a file if it doesn't exist when updating.
   *
   * @returns {Promise<IOrdoFile>} - metadata of the updated file.
   */
  public async update(
    path: OrdoFilePath,
    userId: UserID,
    content: IOrdoFile,
    upsert?: boolean,
  ): Promise<IOrdoFile> {
    const isExistingFile = await this.exists(path)

    if (!isExistingFile) {
      if (!upsert) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

      return this.create(content, userId)
    }

    const metadata = (await this.#metadataDriver.readFile(path)) as IOrdoFile

    // Reassign metadata values that must not be changed
    content.createdAt = metadata.createdAt
    content.createdBy = metadata.createdBy
    content.fsid = metadata.fsid
    content.size = metadata.size
    content.updatedAt = metadata.updatedAt
    content.updatedBy = userId

    const isUnchangedFile = equals(metadata, content)

    // Avoid writing if the object remains deeply equal after the update
    if (isUnchangedFile) return metadata

    const result = (await this.#metadataDriver.updateFile(path, content)) as IOrdoFile

    this.#statsDriver.fileUpdated(userId, metadata, content)

    return result
  }

  /**
   * Removes given file and its content.
   *
   * @throws if a file does not exist under given path.
   * @throws if errors occur in drivers.
   *
   * @param {OrdoFilePath} path - path to the file.
   * @param {UserID} userId - id of the user removing the file.
   *
   * @returns {Promise<IOrdoFile>} - metadata of the removed file.
   */
  public async remove(path: OrdoFilePath, userId: UserID): Promise<IOrdoFile> {
    const isExistingFile = await this.exists(path)

    if (!isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

    const metadata = (await this.#metadataDriver.readFile(path)) as IOrdoFile

    await this.#fileDriver.delete(metadata.fsid)
    await this.#metadataDriver.deleteFile(path)

    this.#statsDriver.fileRemoved(userId, metadata)

    return metadata
  }

  /**
   * Fetches the contents of the file.
   *
   * @throws if a file does not exist under given path.
   * @throws if errors occur in drivers.
   *
   * @param {OrdoFilePath} path - path to the file.
   * @param {UserID} userId - id of the user fetching the file content.
   *
   * @returns {Promise<Content>} - content of the requested file.
   */
  public async getContent(path: OrdoFilePath, userId: UserID): Promise<Content> {
    const isExistingFile = await this.exists(path)

    if (!isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

    const metadata = (await this.#metadataDriver.readFile(path)) as IOrdoFile

    this.#statsDriver.fileContentFetched(userId, metadata)

    return this.#fileDriver.read(metadata.fsid) as Promise<Content>
  }

  /**
   * Update contents of a file under given path with given content.
   *
   * @throws if a file does not exist under given path.
   * @throws if errors occur in drivers.
   *
   * @param path - path to the file.
   * @param userId - id of the user updating the file content.
   * @param content - new content of the file.
   *
   * @returns Promise<IOrdoFile> - metadata of the updated file.
   */
  public async updateContent(
    path: OrdoFilePath,
    userId: UserID,
    content: Content,
  ): Promise<IOrdoFile> {
    const exists = await this.exists(path)

    if (!exists) {
      throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)
    }

    const metadata = (await this.#metadataDriver.readFile(path)) as IOrdoFile
    const size = (await this.#fileDriver.update(metadata.fsid, content)) as number

    metadata.size = size
    metadata.updatedAt = new Date(Date.now())
    metadata.updatedBy = userId

    const result = (await this.#metadataDriver.updateFile(path, metadata)) as IOrdoFile

    this.#statsDriver.fileContentUpdated(userId, result)

    return result
  }
}
