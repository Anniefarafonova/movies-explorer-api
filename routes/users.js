const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regexEmail = require('../utils/constRegular');
const {
  getUsers,
  patchUsers,
} = require('../controllers/users');

// # возвращает информацию о пользователе (email и имя)
router.get('/users/me', getUsers);

// # обновляет информацию о пользователе (email и имя)
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().pattern(regexEmail),
  }),
}), patchUsers);

module.exports = router;
