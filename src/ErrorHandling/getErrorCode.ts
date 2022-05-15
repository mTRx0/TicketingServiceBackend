import { ErrorName, ErrorType } from "./ErrorType";

export const getErrorCode = (errorName: ErrorName) => {
  return ErrorType[errorName];
}  