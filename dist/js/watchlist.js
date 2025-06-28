import { fetchAPIData } from './api.js';
import { initializeWatchlistButtons } from './app.js';
import { displayRatingsBackground, getDate } from './utils.js';

// CHECK IF WATCHLIST PAGE IS EMPTY
export function checkWatchlistPage() {
  // Get saved watchlist
  const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

  if (savedWatchlist.length === 0) {
    const div = document.createElement('div');
    div.innerHTML =
      '<p class="text-xl text-lightBlack">Your watchlist is empty.</p>';

    document.querySelector('#watchlist').insertAdjacentElement('afterend', div);
  }
}

// DISPLAY WATCHLIST PAGE

export async function displayWatchlistPage() {
  // Get saved watchlist
  const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

  if (savedWatchlist.length === 0) {
    const div = document.createElement('div');
    div.innerHTML =
      '<p class="text-xl text-lightBlack">Your watchlist is empty.</p>';

    document.querySelector('#watchlist').insertAdjacentElement('afterend', div);
    return;
  }

  // Now fetch each movie's full details from API
  for (const savedMovie of savedWatchlist) {
    try {
      // Fetch using the saved ID
      const movieDetails = await fetchAPIData(
        `${savedMovie.mediaType}/${savedMovie.movieId}`
      );

      displayWatchlistMovieCard(movieDetails, savedMovie.mediaType);
    } catch (error) {
      console.log('Error fetching movie:', savedMovie.movieId);
    }
  }

  // After all movies are loaded, initialize the buttons (they should all be "added" state)
  setTimeout(() => {
    initializeWatchlistButtons();
  }, 500);
}

//
//

// DISPLAY WATCHLIST MOVIE CARDS

export function displayWatchlistMovieCard(movie, mediaType) {
  console.log(movie);
  console.log(mediaType);
  const div = document.createElement('div');
  div.classList.add('movie-card');

  div.innerHTML = `<div class="relative">
              <a href="${mediaType}-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.title || movie.name}"
          />`
                : `<img
          src="images/mk_poster.jpg"
          class="card-img-top"
          alt="${movie.title || movie.name}"
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
              <p class="movie-card-title">${movie.title || movie.name}</p>
              <p class="movie-card-date">${
                movie.release_date
                  ? getDate(movie.release_date)
                  : getDate(movie.first_air_date)
              } • ${movie.genres[0].name.split(' & ')[0]}</p>
              <button id="movie-card-btn" class="watchlist-btn movie-card-watchlist transition-all duration-300 watchlist-page" data-movie-id="${
                movie.id
              }" data-media-type=${mediaType} href=""
                ><i class="fa-solid fa-trash mr-2"></i>
        <span>Remove from Watchlist</span></button>
            </div>`;

  const watchlistContainerEl = document.querySelector('#watchlist');

  watchlistContainerEl.appendChild(div);

  displayRatingsBackground(watchlistContainerEl);
}
