const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedErrors = require('../errors/UnauthorizedErrors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedErrors('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedErrors('Необходима авторизация');
  }
  req.user = payload;

  next();
};
