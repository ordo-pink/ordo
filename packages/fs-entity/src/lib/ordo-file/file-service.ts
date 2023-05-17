import {
  FileDriver,
  MetadataDriver,
  FilePath,
  FileCreateParams,
  UserID,
  FileDTO,
  OrdoError,
  OrdoErrorCode,
} from "@ordo-pink/common-types"
import { equals } from "ramda"

/**
 * FileService provides access to Ordo files and their metadata.
 *
 * TODO: Partial updates for text files.
 * TODO: Fetching lists of files with given filters.
 */
export class FileService<Content> {
  /**
   * Constructs a FileService.
   */
  public static of<Content>(
    fileDriver: FileDriver<Content>,
    metadataDriver: MetadataDriver,
  ): FileService<Content> {
    return new FileService<Content>(fileDriver, metadataDriver)
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
   * @constructor
   */
  protected constructor(fileDriver: FileDriver<Content>, metadataDriver: MetadataDriver) {
    this.#fileDriver = fileDriver
    this.#metadataDriver = metadataDriver
  }

  /**
   * Check if a file under given path exists. A file is considered existing if
   * there is a physical file, and metadata record associated with it.
   *
   * @throws if errors occur in drivers.
   *
   * @param {UserID} userId - id of the user who owns the space where the file is checked.
   * @param {FilePath} path - path to the file.
   *
   * @returns {Promise<boolean>} - whether the file exists or not.
   */
  public async exists(userId: UserID, path: FilePath): Promise<boolean> {
    const metadata = await this.#metadataDriver.getFile(userId, path)

    if (!metadata) return false

    return this.#fileDriver.exists(userId, metadata.fsid)
  }

  /**
   * Creates an OrdoFile as a physical empty file, and metadata associated with
   * it. If file content is provided, the created file will be updated with the
   * provided content. Assigns default file metadata properties.
   *
   * @throws if a file with given path already exists.
   * @throws if errors occur in drivers.
   *
   * @param {UserID} userId - id of the user who owns the space where the file is created.
   * @param {FileCreateParams} file - file metadata to be saved.
   * @param {string | false} encryption - file body encryption type.
   * @param {Content} content - @optional content of the created file.
   *
   * @returns {Promise<FileDTO>} - metadata of the created file.
   */
  public async create(
    userId: UserID,
    file: FileCreateParams,
    encryption: string | false = false,
    content?: Content,
  ): Promise<FileDTO> {
    const isExistingFile = await this.exists(userId, file.path)

    if (isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_ALREADY_EXISTS)

    const fsid = await this.#fileDriver.create(userId, file.path, encryption)

    // Reassign metadata values that must not be changed
    file.fsid = fsid
    file.size = 0
    file.createdAt = new Date(Date.now())
    file.updatedAt = new Date(Date.now())
    file.createdBy = userId
    file.updatedBy = userId
    file.encryption = encryption

    // Save content to the file if the content was provided
    if (content) {
      const size = (await this.#fileDriver.update(userId, fsid, content, file.encryption)) as number
      file.size = size
    }

    return this.#metadataDriver.createFile(userId, file as FileDTO)
  }

  /**
   * Get metadata of the file under given path.
   *
   * @throws if a file with given path does not exist.
   * @throws if errors occur in drivers.
   *
   * @param {UserID} userId - id of the user who owns the space where the file is located.
   * @param {FilePath} path - path to the file.
   *
   * @returns {Promise<FileDTO>} - metadata of the requested file.
   */
  public async get(userId: UserID, path: FilePath): Promise<FileDTO> {
    const isExistingFile = await this.exists(userId, path)

    if (!isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

    return this.#metadataDriver.getFile(userId, path) as Promise<FileDTO>
  }

  /**
   * Update metadata of a file under given path.
   *
   * @throws if a file does not exist under given path, and upsert is not true.
   * @throws if errors occur in drivers.
   *
   * @param {UserID} userId - id of the user who owns the space where the file is located.
   * @param {FilePath} path - path to the file.
   * @param {Content} content - content to be saved.
   * @param {boolean} upsert - @optional flag that allows creating a file if it doesn't exist when updating.
   *
   * @returns {Promise<FileDTO>} - metadata of the updated file.
   */
  public async update(
    userId: UserID,
    path: FilePath,
    content: FileDTO,
    upsert?: boolean,
  ): Promise<FileDTO> {
    const isExistingFile = await this.exists(userId, path)

    if (!isExistingFile) {
      if (!upsert) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

      return this.create(userId, content, userId)
    }

    const metadata = (await this.#metadataDriver.getFile(userId, path)) as FileDTO

    // Reassign metadata values that must not be changed
    content.createdAt = metadata.createdAt
    content.createdBy = metadata.createdBy
    content.fsid = metadata.fsid
    content.size = metadata.size
    content.updatedAt = metadata.updatedAt
    content.updatedBy = userId

    const isUnchangedFile = equals(metadata, content)

    // Avoid writing if the object remains deeply equal after the update
    return isUnchangedFile
      ? metadata
      : (this.#metadataDriver.updateFile(userId, path, content) as Promise<FileDTO>)
  }

  /**
   * Removes given file and its content.
   *
   * @throws if a file does not exist under given path.
   * @throws if errors occur in drivers.
   *
   * @param {UserID} userId - id of the user who owns the space where the file is located.
   * @param {FilePath} path - path to the file.
   *
   * @returns {Promise<FileDTO>} - metadata of the removed file.
   */
  public async remove(userId: UserID, path: FilePath): Promise<FileDTO> {
    const isExistingFile = await this.exists(userId, path)

    if (!isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

    const metadata = (await this.#metadataDriver.getFile(userId, path)) as FileDTO

    await this.#fileDriver.delete(userId, metadata.fsid)
    await this.#metadataDriver.removeFile(userId, path)

    return metadata
  }

  /**
   * Fetches the contents of the file.
   *
   * @throws if a file does not exist under given path.
   * @throws if errors occur in drivers.
   *
   * @param {UserID} userId - id of the user who owns the space where the file is located.
   * @param {FilePath} path - path to the file.
   *
   * @returns {Promise<Content>} - content of the requested file.
   */
  public async getContent(userId: UserID, path: FilePath): Promise<Content> {
    const isExistingFile = await this.exists(userId, path)

    if (!isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

    const metadata = (await this.#metadataDriver.getFile(userId, path)) as FileDTO

    return this.#fileDriver.read(userId, metadata.fsid, metadata.encryption) as Promise<Content>
  }

  /**
   * Update contents of a file under given path with given content.
   *
   * @throws if a file does not exist under given path.
   * @throws if errors occur in drivers.
   *
   * @param userId - id of the user who owns the space where the file is located.
   * @param path - path to the file.
   * @param content - new content of the file.
   *
   * @returns Promise<IOrdoFile> - metadata of the updated file.
   */
  public async updateContent(userId: UserID, path: FilePath, content: Content): Promise<FileDTO> {
    const exists = await this.exists(userId, path)

    if (!exists) {
      throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)
    }

    const metadata = (await this.#metadataDriver.getFile(userId, path)) as FileDTO
    const size = (await this.#fileDriver.update(
      userId,
      metadata.fsid,
      content,
      metadata.encryption,
    )) as number

    metadata.size = size
    metadata.updatedAt = new Date(Date.now())
    metadata.updatedBy = userId

    return this.#metadataDriver.updateFile(userId, path, metadata) as Promise<FileDTO>
  }

  public getTotalSize(userId: UserID): Promise<number> {
    return this.#metadataDriver.getTotalSize(userId)
  }
}
