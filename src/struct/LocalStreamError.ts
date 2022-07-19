export enum ErrorType {
  UNCAUGHT = "The application has encountered an error outside of catch blocks.",
  UNHANDLED = "The application has encountered an error, and was not able to handle it.",
  UNKNOWN = "The application has encountered an unknown error.",
  INITIALIZATION_FAILED = "The application was unable to initialize.",
  UNABLE_TO_WRITE_FILE = "The application was unable to write to a file.",
  UNABLE_TO_RESTART_SERVER = "Server is not restarted.",
  UNABLE_TO_LIST_FILES = "Error occurred while listing files.",
  UNABLE_TO_LOAD_FILES = "Error occurred while loading files.",
  UNABLE_TO_STREAM_FILES = "Error occurred while streaming files.",
}

const getMessage = (type: keyof typeof ErrorType, message: string): string => {
  return `${new Date()} | [LocalStreamError]: ${type}: ${message}`;
};

export default class LocalStreamError extends Error {
  constructor(errorType: keyof typeof ErrorType, error: any) {
    super(getMessage(errorType, error));
  }
}
