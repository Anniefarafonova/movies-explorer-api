const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const Movie = require('../model/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => {
      // if (movie.owner.equals(req.user._id)) {
      res.status(httpConstants.HTTP_STATUS_OK).send(movie);
    })
    // })
    .catch((err) => {
      next(err);
    });
};

// создаёт фильм
module.exports.postMovies = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(httpConstants.HTTP_STATUS_CREATED).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

//  удаляет сохранённый фильм по id
module.exports.deleteMoviesID = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Фильм другого пользователя.');
      }
      Movie.findByIdAndRemove(movie)
        .orFail()
        .then(() => {
          res.status(httpConstants.HTTP_STATUS_OK).send({ message: 'Фильм удален.' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Пользователь по указанному _id не найден.'));
          } else if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError('Переданы некорректные данные.'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};
