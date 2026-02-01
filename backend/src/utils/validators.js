const isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeUser = (user) => {
  // Remove sensitive data before sending to client
  const { password, ...safeUser } = user;
  return safeUser;
};

module.exports = { isEmail, sanitizeUser };