import bcrypt from 'bcryptjs';

export function checkPassword(password, hash) {
  return bcrypt.compare(password, hash);
};
