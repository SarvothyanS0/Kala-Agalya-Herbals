/**
 * Validates password against the security policy.
 *
 * Policy:
 *  - Minimum 8 characters
 *  - At least 1 uppercase letter (A-Z)
 *  - At least 1 number (0-9)
 *  - At least 1 symbol from: ! @ & # $ % ^ * ( ) _ + - = [ ] { } | ; : ' " , . < > ? / ~ `
 *
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password || typeof password !== "string") {
    return { valid: false, errors: ["Password is required"] };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least 1 number");
  }

  if (!/[!@&#$%^*()\-_+=\[\]{}|;:'",.<>?/~`]/.test(password)) {
    errors.push("Password must contain at least 1 special character (!@& etc.)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = validatePassword;
