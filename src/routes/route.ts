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
  tvEpisode,
  info,
  cast,
  production
} from '../controllers/index';
import { m3u8Proxy } from '../proxy/m3u8-proxy';

export const router = Router();

// proxy endpoints
router.get('/m3u8-proxy', m3u8Proxy);

// movie and tv endpoints
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

router.get('/info/:type/:id', info);

router.get('/cast/:castId', cast);

router.get('/production/:productionId', production);

router.get('/tv-season/:id', tvSeason);

router.get('/tv-episode/:seasonId', tvEpisode)

router.get('/server/:type/:id', server);

router.get('/sources/:serverId', sources);