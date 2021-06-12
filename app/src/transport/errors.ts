export enum ErrorCode {
  Conflict = 'conflict',
}

// Example - not currently used
export class ConflictError extends Error {
  public code = ErrorCode.Conflict;
}
