export enum OrdoErrorCode {
  UNEXPECTED_ERROR,
  FILE_NOT_FOUND,
  FILE_ALREADY_EXISTS,
  UPDATE_FSID_FORBIDDEN,
  UPDATE_SIZE_FORBIDDEN,
  UPDATE_CREATED_AT_FORBIDDEN,
  UPDATE_CREATED_BY_FORBIDDEN,
  INVALID_FILE_PATH,
}

export class OrdoError extends Error {
  private code: OrdoErrorCode

  public static of(code: OrdoErrorCode, message?: string) {
    return new OrdoError(code, message)
  }

  protected constructor(code: OrdoErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
