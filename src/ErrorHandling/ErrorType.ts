export enum ErrorName {
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  SERVER_ERROR = 'SERVER_ERROR',
  INVALID_ARGUMENTS = 'INVALID_ARGUMENTS',
  INCORRECT_DATA = 'INCORRECT_DATA'
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
  INVALID_ARGUMENTS: {
    message: 'Invalid arguments.',
    errorCode: 'S1',
    statusCode: 400
  }
}