export enum ErrorType {
  UNCAUGHT = "The application has encountered an error outside of catch blocks.",
  UNHANDLED = "The application has encountered an error, and was not able to handle it.",
  UNKNOWN = "The application has encountered an unknown error.",
  INITIALIZATION_FAILED = "The application was unable to initialize.",
}

const getMessage = (type: keyof typeof ErrorType, message: string): string => {
  return `${new Date()} | [LocalStreamError]: ${type}: ${message}`;
};

export default class LocalStreamError extends Error {
  constructor(errorType: keyof typeof ErrorType, error: any) {
    super(getMessage(errorType, error));
  }
}
