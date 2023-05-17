export enum OrdoErrorCode {
  UNEXPECTED_ERROR,
  FILE_NOT_FOUND,
  FILE_ALREADY_EXISTS,
  UPDATE_FSID_FORBIDDEN,
  UPDATE_SIZE_FORBIDDEN,
  UPDATE_CREATED_AT_FORBIDDEN,
  UPDATE_CREATED_BY_FORBIDDEN,
  INVALID_FILE_PATH,
  INVALID_FILE_SIZE,
  MISSING_REQUIRED_FILE_FIELD,
  INVALID_DIRECTORY_PATH,
  MISSING_REQUIRED_DIRECTORY_FIELD,
  DIRECTORY_NOT_FOUND,
  DIRECTORY_ALREADY_EXISTS,
  USER_NOT_FOUND,
  USER_ALREADY_EXISTS,
}

export class OrdoError extends Error {
  private code: OrdoErrorCode

  public static of(code: OrdoErrorCode, message?: string) {
    return new OrdoError(code, message)
  }

  public static isOrdoError(x: unknown): x is OrdoError {
    return x instanceof OrdoError
  }

  public static hasCode(x: unknown, code: OrdoErrorCode): boolean {
    return OrdoError.isOrdoError(x) && x.code === code
  }

  protected constructor(code: OrdoErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
