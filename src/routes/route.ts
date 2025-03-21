import { Router } from 'express';
import {
  spotlight,
  trending,
  latestMovie,
  latestTvShow,
  topImdb,
  movie,
  tvShow,
  genreList,
  countryList,
  genre,
  country,
  search,
  sources,
  server,
  tvSeason,
  tvEpisode
} from '../controllers/index';

export const router = Router();

router.get('/spotlight', spotlight);

router.get('/trending', trending);

router.get('/latest-movie', latestMovie);

router.get('/latest-tv-show', latestTvShow);

router.get('/top-imdb', topImdb);

router.get('/movie', movie);

router.get('/tv-show', tvShow);

router.get('/genre-list', genreList);

router.get('/genre/:genreId', genre);

router.get('/country-list', countryList);

router.get('/country/:countryId', country);

router.get('/search/:keyword', search);

router.get('/tv-season/:id', tvSeason);

router.get('/tv-episode/:seasonId', tvEpisode)

router.get('/server/:type/:id', server);

router.get('/sources/:serverId', sources);