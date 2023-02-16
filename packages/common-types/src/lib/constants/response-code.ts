/**
 * Possible exception status codes under the frontend-backend contract.
 */
export enum ExceptionResponse {
  /**
   * The incoming request is malformed. Response body contains a text string
   * describing the mistakes in the request.
   */
  BAD_REQUEST = 400,

  /**
   * Authorisation token not provided. Response body is empty.
   */
  UNAUTHORISED = 401,

  /**
   * Authorisation token is invalid. Response body is empty.
   */
  FORBIDDEN = 403,

  /**
   * Entity not found. Response body is empty.
   */
  NOT_FOUND = 404,

  /**
   * Entity already exists. Response body is empty.
   */
  CONFLICT = 409,

  /**
   * Unexpected server error occured. Response body contains a text string
   * describing the error.
   */
  UNKNOWN_ERROR = 500,
}

/**
 * Possible success status codes under the frontend-backend contract.
 */
export enum SuccessResponse {
  /**
   * Request succeeded. Response body depends on the action.
   */
  OK = 200,

  /**
   * Request succeeded, and a new entity was created. Response body depends on
   * the action.
   */
  CREATED = 201,
}
