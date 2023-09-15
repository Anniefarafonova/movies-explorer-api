const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  postMovies,
  deleteMoviesID,
} = require('../controllers/movie');

// # возвращает все сохранённые текущим пользователем фильмы
router.get('/movies', getMovies);

// # создаёт фильм с переданными в теле:
// country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail,movieId
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    trailerLink: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovies);

// # удаляет сохранённый фильм по id
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMoviesID);

module.exports = router;
