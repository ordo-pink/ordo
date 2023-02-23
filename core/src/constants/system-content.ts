/**
 * Reserved directory paths that must not be created at the root level of the
 * user directory.
 */
export enum SystemDirectory {
  /**
   * A place where Ordo stores internal data that must never be manually
   * changed.
   */
  INTERNAL = "/__ordo-internal__/",
  /**
   * A place where OrdoExtension persisted store saves cross-session extension
   * data. Every extension has its own "$EXTENSION_NAME.json" file inside. The
   * data is stored in a JSON Web Token so manual changing of the content will
   * result into losing the data.
   */
  EXTENSIONS = "/__ordo-internal__/__extensions__/",

  /**
   * A place where OrdoExtension user preferences are stored. Every extension
   * has its own "$EXTENSION_NAME.json" file inside. The data is stored in a
   * JSON Web Token so manual changing of the content will result into losing
   * the data.
   */
  PREFERENCES = "/__ordo-internal__/__preferences__/",
}

/**
 * Reserved file paths that must not be created at the root level of the user
 * directory.
 */
export enum SystemFiles {
  /**
   * A place where Ordo stores the information about sharing content with other
   * accounts. The data is stored in a JSON Web Token so manual changing of the
   * content will result into losing the data and revoking all permissions.
   */
  PERMISSIONS = "__ordo-internal__/permissions.json",
}
