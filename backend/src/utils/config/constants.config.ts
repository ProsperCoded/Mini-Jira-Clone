export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';
export const DEFAULT_SUCCESS_MESSAGE = 'Operation completed successfully';

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
