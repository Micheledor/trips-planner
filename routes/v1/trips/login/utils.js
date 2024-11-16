import bcrypt from 'bcryptjs';

export const checkPassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateJwtToken = (jwt, user) => {
  return jwt.sign({ id: user._id });
};
