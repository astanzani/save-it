import validator from 'validator';

export function isEmail(candidate: string) {
  return validator.isEmail(candidate);
}

export function isStrongPassword(candidate: string) {
  return validator.isStrongPassword(candidate, {
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  });
}

export function isName(candidate: string) {
  return candidate.length >= 2;
}
