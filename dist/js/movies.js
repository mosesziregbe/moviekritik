import { fetchAPIData, getGenreName } from './api.js';
import { getDate, displayRatingsBackground } from './utils.js';
import { initializeWatchlistButtons } from './app.js';

// 1. DISPLAY 20 TRENDING MOVIES

export async function displayTrendingMoviesToday() {
  const { results } = await fetchAPIData('trending/all/day');

  // console.log(results);

  results.forEach(async (item) => {
    // Create a div
    const div = document.createElement('div');

    // Add the classname - 'movie-card'
    div.classList.add('movie-card');

    const genreName = await getGenreName(
      `${item.media_type === 'movie' ? 'movie' : 'tv'}`,
      item.genre_ids[0]
    );

    div.innerHTML = `<div class="relative">
    <a
        href="${item.media_type === 'movie' ? 'movie' : 'tv'}-details.html?id=${
      item.id
    }"
    >
        <div>
            ${
              item.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500${
                    item.poster_path
                  }" class="test-shine" alt="${item.title || item.name}" />`
                : `
            <img src="images/mk_poster.jpg" class="test-shine" alt="${
              item.title || item.name
            }" />`
            }
        </div>
    </a>
    <span class="ratings absolute rounded top-2 right-2 text-white px-2 py-1 text-sm font-semibold">${
      item.vote_average > 0 ? `${Math.round(item.vote_average * 10)}%` : 'NA'
    }</span>
</div>
<!-- Flex Container for Movie Details -->
<div class="movie-details">
    <p class="movie-card-title">${item.title || item.name}</p>
    <p class="movie-card-date">${
      item.release_date
        ? getDate(item.release_date)
        : getDate(item.first_air_date)
    } • ${genreName.split(' & ')[0]}</p>
    <button id="movie-card-btn" class="movie-card-watchlist transition-all duration-300" data-movie-id="${
      item.id
    }" data-media-type="${
      item.media_type === 'movie' ? 'movie' : 'tv'
    }" href="">
        <i class="fa-solid fa-square-plus"></i>
        <i class="fa-solid fa-check"></i>
        <span class="not-watchlisted">Add to Watchlist</span>
        <span class="in-watchlist">In Watchlist</span>
    </button>
</div>
`;

    const trendingTodayEl = document.querySelector('#trending-today');
    trendingTodayEl.appendChild(div);

    displayRatingsBackground(trendingTodayEl);
  });

  setTimeout(() => {
    initializeWatchlistButtons();
  }, 1000);
}

// 2. Display 10 most popular Movies

export async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  const recentMovies = results
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date)) // Sort by newest first
    .slice(0, 10); // Then take first 10 items

  // console.log(recentMovies);

  recentMovies.forEach(async (movie) => {
    // Create a div
    const div = document.createElement('div');

    // Add the classname - 'movie-card'
    div.classList.add('movie-card');

    const genreName = await getGenreName('movie', movie.genre_ids[0]);

    div.innerHTML = `<div class="relative">
              <a href="movie-details.html?id=${movie.id}">
              <div>
            ${
              movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.title}"
          />`
                : `<img
          src="images/mk_poster.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
            }
            </div>
          </a>
              <span
                class="ratings absolute rounded top-2 right-2 text-white px-2 py-1 text-sm font-semibold"
                >${
                  movie.vote_average > 0
                    ? `${Math.round(movie.vote_average * 10)}%`
                    : 'NA'
                }</span
              >
            </div>
            <!-- Flex Container for Movie Details -->
            <div class="movie-details">
              <p class="movie-card-title">${movie.title}</p>
              <p class="movie-card-date">${getDate(movie.release_date)} • ${
      genreName.split(' & ')[0]
    }</p>
              <button id="movie-card-btn" class="movie-card-watchlist transition-all duration-300" data-movie-id="${
                movie.id
              }" data-media-type=${movie.media_type} href=""
                ><i class="fa-solid fa-square-plus"></i
                ><i class="fa-solid fa-check"></i><span class="not-watchlisted">Add to Watchlist</span><span class="in-watchlist">In Watchlist</span></button
              >
            </div>`;

    const popularMoviesEl = document.querySelector('#popular-movies');
    popularMoviesEl.appendChild(div);

    displayRatingsBackground(popularMoviesEl);
  });
}

// 3. ALL POPULAR MOVIES

export async function displayAllPopularMovies() {
  const data = await fetchAPIData('movie/popular');
  const { results } = await fetchAPIData('movie/popular');

  console.log(data);
  console.log(results);

  results.forEach(async (movie) => {
    // Create a div
    const div = document.createElement('div');

    // Add the classname - 'movie-card'
    div.classList.add('movie-card');

    const genreName = await getGenreName('movie', movie.genre_ids[0]);

    div.innerHTML = `<div class="relative">
              <a href="movie-details.html?id=${movie.id}">
              <div>
            ${
              movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.title}"
          />`
                : `<img
          src="images/mk_poster.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
            }
            </div>
          </a>
              <span
                class="ratings absolute rounded top-2 right-2 text-white px-2 py-1 text-sm font-semibold"
                >${
                  movie.vote_average > 0
                    ? `${Math.round(movie.vote_average * 10)}%`
                    : 'NA'
                }</span
              >
            </div>
            <!-- Flex Container for Movie Details -->
            <div class="movie-details">
              <p class="movie-card-title">${movie.title}</p>
              <p class="movie-card-date">${getDate(movie.release_date)} • ${
      genreName.split(' & ')[0]
    }</p>
              <button id="movie-card-btn" class="movie-card-watchlist transition-all duration-300" data-movie-id="${
                movie.id
              }" data-media-type=${'movie'} href=""
                ><i class="fa-solid fa-square-plus"></i
                ><i class="fa-solid fa-check"></i><span class="not-watchlisted">Add to Watchlist</span><span class="in-watchlist">In Watchlist</span></button
              >
            </div>`;

    const AllPopularMoviesEl = document.querySelector('#popular-movies-all');
    AllPopularMoviesEl.appendChild(div);

    displayRatingsBackground(AllPopularMoviesEl);
  });

  setTimeout(() => {
    initializeWatchlistButtons();
  }, 1000);
}
