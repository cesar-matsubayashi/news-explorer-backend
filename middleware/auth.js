const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new AuthError("Autorização necessária"));
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch {
    return next(new AuthError("Autorização necessária"));
  }

  req.user = payload;

  return next();
};
