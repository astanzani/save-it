export type UserId = string;

export interface User {
  _id: UserId;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
}

export interface NewUserInfo {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
}
