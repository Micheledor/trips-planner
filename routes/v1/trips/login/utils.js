import bcrypt from 'bcryptjs';

export function checkPassword(password, hash) {
  return bcrypt.compare(password, hash);
};

export function generateJwtToken(jwt, user) {
  return jwt.sign({ id: user._id });
};
