import { fetchAPIData, getGenreName } from './api.js';
import { getDate, displayRatingsBackground } from './utils.js';

//  Display 10 streaming tv shows

export async function displayStreamingShows() {
  const { results } = await fetchAPIData('trending/tv/week');

  const recentShows = results
    .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date)) // Sort by newest first
    .slice(0, 15); // Then take first 10 items

  recentShows.forEach(async (movie) => {
    // Create a div
    const div = document.createElement('div');

    // Add the classname - 'movie-card'
    div.classList.add('movie-card');

    const genreName = await getGenreName('tv', movie.genre_ids[0]);

    div.innerHTML = `<div class="relative">
              <a href="tv-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.name}"
          />`
                : `<img
          src="images/mk_poster.jpg"
          class="card-img-top"
          alt="${movie.name}"
        />`
            }
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
              <p class="movie-card-title">${movie.name}</p>
              <p class="movie-card-date">${getDate(movie.first_air_date)} • ${
      genreName.split(' & ')[0]
    }</p>
              <button id="movie-card-btn" class="movie-card-watchlist transition-all duration-300" data-movie-id="${
                movie.id
              }" data-media-type=${movie.media_type} href=""
                ><i class="fa-solid fa-square-plus"></i
                ><i class="fa-solid fa-check"></i><span class="not-watchlisted">Add to Watchlist</span><span class="in-watchlist">In Watchlist</span></button
              >
            </div>`;

    const streamingEl = document.querySelector('#streaming');
    streamingEl.appendChild(div);

    displayRatingsBackground(streamingEl);
  });
}

// ALL POPULAR SHOWS

export async function displayAllPopularShows() {
  const { results } = await fetchAPIData('trending/tv/day');

  console.log(results);

  // Filter shows released in the past 3 years
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const recentShows = results
    .filter((show) => {
      const releaseDate = new Date(show.first_air_date);
      return releaseDate >= threeYearsAgo;
    })
    .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date)); // Sort by newest first

  recentShows.forEach(async (movie) => {
    // Create a div
    const div = document.createElement('div');

    // Add the classname - 'movie-card'
    div.classList.add('movie-card');

    const genreName = await getGenreName('tv', movie.genre_ids[0]);

    div.innerHTML = `<div class="relative">
              <a href="tv-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.name}"
          />`
                : `<img
          src="images/mk_poster.jpg"
          class="card-img-top"
          alt="${movie.name}"
        />`
            }
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
              <p class="movie-card-title">${movie.name}</p>
              <p class="movie-card-date">${getDate(movie.first_air_date)} • ${
      genreName.split(' & ')[0]
    }</p>
              <button id="movie-card-btn" class="movie-card-watchlist transition-all duration-300" data-movie-id="${
                movie.id
              }" data-media-type=${'tv'} href=""
                ><i class="fa-solid fa-square-plus"></i
                ><i class="fa-solid fa-check"></i><span class="not-watchlisted">Add to Watchlist</span><span class="in-watchlist">In Watchlist</span></button
              >
            </div>`;

    const AllPopularShowsEl = document.querySelector('#popular-shows-all');
    AllPopularShowsEl.appendChild(div);

    displayRatingsBackground(AllPopularShowsEl);
  });
}
