require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const usersRout = require('./routes/users');
const moviesRout = require('./routes/movies');
const auth = require('./middlewares/auth');
const { PORT, DB_URL } = require('./utils/config');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { postUsers, login } = require('./controllers/users');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);
// подключаем rate-limiter
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/),
    password: Joi.string().min(5).required(),
  }),
}), login);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().pattern(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/),
    password: Joi.string().min(5).required(),
  }),
}), postUsers);

// авторизация
app.use(auth);
app.use('/', usersRout);
app.use('/', moviesRout);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

// обработчики ошибок celebrate
app.use(errors());

app.use((err, req, res, next) => {
  // const { statusCode = 500, message } = err;
  // res
  //   .status(statusCode)
  //   .send({
  //     message: statusCode === 500
  //       ? 'На сервере произошла ошибка'
  //       : message,
  //   });
  next();
});

app.listen(PORT, () => {
  console.log(`порт приложение слушает ${PORT}`);
});
