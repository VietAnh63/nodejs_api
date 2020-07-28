module.exports = {
  jsonwebtoken: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  app: {
    PORT: process.env.PORT || 3000,
  },
};
