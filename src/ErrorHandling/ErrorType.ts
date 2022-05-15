export enum ErrorName {
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  SERVER_ERROR = 'SERVER_ERROR',
  INVALID_ARGUMENTS = 'INVALID_ARGUMENTS',
  INCORRECT_DATA = 'INCORRECT_DATA',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}

export const ErrorType = {
  USER_ALREADY_EXISTS: {
    message: 'User is already exists.',
    errorCode: 'A0',
    statusCode: 403
  },
  INCORRECT_DATA: {
    message: 'Incorrect data',
    errorCode: 'A1',
    statusCode: 400
  },
  SERVER_ERROR: {
    message: 'Server error.',
    errorCode: 'S0',
    statusCode: 500
  },
  UNAUTHENTICATED: {
    message: 'Not authenticated',
    errorCode: 'F0',
    statusCode: 403
  },
  INVALID_ARGUMENTS: {
    message: 'Invalid arguments.',
    errorCode: 'F1',
    statusCode: 400
  },
  INVALID_REFRESH_TOKEN: {
    message: 'Invalid refresh token.',
    errorCode: 'F2',
    statusCode: 400
  }
}