export const VALIDATION_MESSAGES = {
  IS_EMPTY: (fieldName: string) => `${fieldName} should not be empty.`,
  IS_STRING: (fieldName: string) => `${fieldName} must be a string.`,

  INTERNAL_ERROR: 'INTERNAL ERROR',

  EMAIL_INVALID: 'Email is invalid.',
  EMAIL_USED: 'The email has already been used.',
  PASSWORD_MIN_LENGTH: (min: number) =>
    `Password must be at least ${min} characters long.`,
};
