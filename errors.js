const errors = {
  NOT_DIRECTORY: "api.not-directory",
  UNKNOWN_ERROR: "api.unknown-error",
  NOT_FOUND: "api.not-found",
  BAD_REQUEST: "api.invalid-request",
  FILE_EXISTS: "api.files.file-exists",
  DIRECTORY_EXISTS: "api.files.folder-exists",
};

/**
 *
 * @param {keyof errors} type
 * @param {Error?} error
 * @returns {{ error: string; message: string }}
 */
const getErrorMessage = (type, error) => {
  const isDev = process.env.NODE_ENV !== "production";

  if (error) console.error(error);

  return {
    error: type,
    message: isDev ? error.message : void 0,
  };
};

module.exports = {
  errors,
  getErrorMessage,
};
