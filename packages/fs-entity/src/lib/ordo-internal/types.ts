/**
 * Internal Ordo configuration.
 */
export type IOrdoInternal = {
  /**
   * Max size that the user might have.
   */
  maxTotalSize: number

  /**
   * Max size of the file to be uploaded to Ordo.
   */
  maxUploadSize: number

  /**
   * Cached total size of the user root directory.
   */
  totalSize: number
}
