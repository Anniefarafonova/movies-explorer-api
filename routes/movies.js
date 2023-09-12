const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regexUrl = require('../utils/constRegular');
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
    image: Joi.string().required().pattern(regexUrl),
    trailerLink: Joi.string().required().pattern(regexUrl),
    thumbnail: Joi.string().required().pattern(regexUrl),
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
