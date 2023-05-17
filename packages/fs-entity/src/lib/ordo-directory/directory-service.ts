import {
  DirectoryDTO,
  DirectoryCreateParams,
  MetadataDriver,
  DirectoryPath,
  OrdoError,
  OrdoErrorCode,
  UserID,
  FileDTO,
} from "@ordo-pink/common-types"
import { equals } from "ramda"

/**
 * DirectoryService provides access to Ordo directories and their metadata.
 * TODO: Fetching lists of directories with given filters.
 */
export class DirectoryService {
  /**
   * Constructs an DirectoryService.
   */
  public static of(metadataDriver: MetadataDriver): DirectoryService {
    return new DirectoryService(metadataDriver)
  }

  /**
   * Metadata driver is used for managing file and directory metadata.
   */
  #metadataDriver: MetadataDriver

  /**
   * @constructor
   */
  protected constructor(metadataDriver: MetadataDriver) {
    this.#metadataDriver = metadataDriver
  }

  /**
   * Check if a directory under given path exists.
   *
   * @throws if errors occur in drivers.
   *
   * @param {DirectoryPath} path - path to the directory.
   *
   * @returns {Promise<boolean>} - whether the file exists or not.
   */
  public async exists(userId: UserID, path: DirectoryPath): Promise<boolean> {
    return this.#metadataDriver.checkDirectoryExists(userId, path)
  }

  /**
   * Creates an OrdoDirectory.
   *
   * @throws if a directory with given path already exists.
   * @throws if errors occur in drivers.
   *
   * @param {DirectoryCreateParams} directory - directory metadata to be saved.
   * @param {UserID} userId - id of the user creating the directory.
   *
   * @returns {Promise<DirectoryDTO>} - metadata of the created directory.
   */
  public async create(userId: UserID, directory: DirectoryCreateParams): Promise<DirectoryDTO> {
    const isExistingDirectory = await this.exists(userId, directory.path)

    if (isExistingDirectory) throw OrdoError.of(OrdoErrorCode.DIRECTORY_ALREADY_EXISTS)

    // Reassign metadata values that must not be changed
    directory.createdAt = new Date(Date.now())
    directory.updatedAt = new Date(Date.now())
    directory.createdBy = userId
    directory.updatedBy = userId

    const result = await this.#metadataDriver.createDirectory(userId, directory as DirectoryDTO)

    return result
  }

  /**
   * Get metadata of the directory under given path.
   *
   * @throws if a directory with given path does not exist.
   * @throws if errors occur in drivers.
   *
   * @param {DirectoryPath} path - path to the directory.
   * @param {UserID} userId - id of the user fetching the directory.
   *
   * @returns {Promise<DirectoryDTO>} - metadata of the requested directory.
   */
  public async get(userId: UserID, path: DirectoryPath): Promise<DirectoryDTO> {
    const isExistingDirectory = await this.exists(userId, path)

    if (!isExistingDirectory) throw OrdoError.of(OrdoErrorCode.DIRECTORY_NOT_FOUND)

    return this.#metadataDriver.getDirectory(userId, path) as Promise<DirectoryDTO>
  }

  public async getDirectoryChildren(
    userId: UserID,
    path: DirectoryPath,
  ): Promise<(DirectoryDTO | FileDTO)[]> {
    const isExistingDirectory = await this.exists(userId, path)

    if (!isExistingDirectory) throw OrdoError.of(OrdoErrorCode.DIRECTORY_NOT_FOUND)

    return this.#metadataDriver.getDirectoryChildren(userId, path)
  }

  public async getRootDirectory(userId: UserID): Promise<(DirectoryDTO | FileDTO)[]> {
    const isExistingDirectory = await this.exists(userId, "/")

    if (!isExistingDirectory) throw OrdoError.of(OrdoErrorCode.DIRECTORY_NOT_FOUND)

    return this.#metadataDriver.getDirectoryChildren(userId, "/")
  }

  /**
   * Update metadata of a directory under given path.
   *
   * @throws if a directory does not exist under given path, and upsert is not true.
   * @throws if errors occur in drivers.
   *
   * @param {DirectoryPath} path - path to the directory.
   * @param {UserID} userId - id of the user updating the directory.
   * @param {Content} content - content to be saved.
   * @param {boolean} upsert - @optional flag that allows creating a directory if it doesn't exist when updating.
   *
   * @returns {Promise<DirectoryDTO>} - metadata of the updated directory.
   */
  public async update(
    userId: UserID,
    path: DirectoryPath,
    content: DirectoryDTO,
    upsert?: boolean,
  ): Promise<DirectoryDTO> {
    const isExistingDirectory = await this.exists(userId, path)

    if (!isExistingDirectory) {
      if (!upsert) throw OrdoError.of(OrdoErrorCode.DIRECTORY_NOT_FOUND)

      return this.create(userId, content)
    }

    const metadata = (await this.#metadataDriver.getDirectory(userId, path)) as DirectoryDTO

    // Reassign metadata values that must not be changed
    content.createdAt = metadata.createdAt
    content.createdBy = metadata.createdBy
    content.updatedAt = metadata.updatedAt
    content.updatedBy = userId

    const isUnchangedDirectory = equals(metadata, content)

    // Avoid writing if the object remains deeply equal after the update
    if (isUnchangedDirectory) return metadata

    const result = (await this.#metadataDriver.updateDirectory(
      userId,
      path,
      content,
    )) as DirectoryDTO

    return result
  }

  /**
   * Removes given directory and its content.
   *
   * @throws if a directory does not exist under given path.
   * @throws if errors occur in drivers.
   *
   * @param {DirectoryPath} path - path to the directory.
   * @param {UserID} userId - id of the user removing the directory.
   *
   * @returns {Promise<DirectoryDTO>} - metadata of the removed directory.
   */
  public async remove(userId: UserID, path: DirectoryPath): Promise<DirectoryDTO> {
    const isExistingFile = await this.exists(userId, path)

    if (!isExistingFile) throw OrdoError.of(OrdoErrorCode.FILE_NOT_FOUND)

    const metadata = (await this.#metadataDriver.getDirectory(userId, path)) as DirectoryDTO

    await this.#metadataDriver.removeFile(userId, path)

    return metadata
  }
}
