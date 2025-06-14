const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'a417fc1e2fd93fac47f8b9160f3a38cc',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

console.log(global.currentPage);

// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)

//
//

// 1. Display 20 most popular movies

async function displayTrendingMoviesToday() {
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
              <a href="${
                item.media_type === 'movie' ? 'movie' : 'tv'
              }-details.html?id=${item.id}">
            ${
              item.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${item.poster_path}"
            alt="${item.title || item.name}"
          />`
                : `<img
          src="images/mk_poster.jpg"
          class="card-img-top"
          alt="${item.title || item.name}"
        />`
            }
          </a>
              <span
                class="ratings absolute rounded top-2 right-2 text-white px-2 py-1 text-sm font-semibold"
                >${
                  item.vote_average > 0
                    ? `${Math.round(item.vote_average * 10)}%`
                    : 'NA'
                }</span
              >
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
              }" data-media-type=${item.media_type} href=""
                ><i class="fa-solid fa-square-plus"></i
                ><i class="fa-solid fa-check"></i><span class="not-watchlisted">Add to Watchlist</span><span class="in-watchlist">In Watchlist</span></button
              >
            </div>`;

    trendingTodayEl = document.querySelector('#trending-today');
    trendingTodayEl.appendChild(div);

    displayRatingsBackground(trendingTodayEl);
  });

  setTimeout(() => {
    initializeWatchlistButtons();
  }, 2000);
}

// Add this ONCE, outside the function:
document.addEventListener('click', function (e) {
  if (e.target.closest('.movie-card-watchlist')) {
    const movieId = e.target.closest('.movie-card-watchlist').dataset.movieId;
    const mediaType = e.target.closest('.movie-card-watchlist').dataset
      .mediaType;

    const button = e.target.closest('.movie-card-watchlist');

    // const span = button.querySelector('span');

    // button.classList.toggle('active');
    // button.classList.toggle('bg-gray-300');

    const movieData = {
      movieId: button.dataset.movieId,
      mediaType: button.dataset.mediaType,
    };

    console.log('Clicked:', mediaType, movieId);

    // Get Items from local storage
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

    const existingIndex = watchlist.findIndex(
      (item) => item.movieId === movieData.movieId
    );

    if (existingIndex >= 0) {
      //Remove from watchlist
      watchlist.splice(existingIndex, 1);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      broadcastWatchlistChange(movieData, false); // Broadcast Change
    } else {
      // Add to watchlist
      watchlist.push(movieData);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      broadcastWatchlistChange(movieData, true); // Broadcast Change
    }
  }
});

document.addEventListener('watchlistChanged', function (e) {
  const { movieData, isAdded } = e.detail;

  // Find all buttons for this movie
  const buttons = document.querySelectorAll(
    `[data-movie-id="${movieData.movieId}"]`
  );

  console.log('Selector:', `[data-movie-id="${movieData.movieId}"]`);

  // update each button
  buttons.forEach((button) => {
    if (isAdded) {
      button.classList.add('active', 'bg-gray-300');
    } else {
      button.classList.remove('active', 'bg-gray-300');
    }

    // REMOVE THE MOVIE CARD FROM WATCHLIST PAGE
    if (window.location.pathname.includes('watchlist')) {
      button.closest('.movie-card').remove();
    }
  });
});

function broadcastWatchlistChange(movieData, isAdded) {
  document.dispatchEvent(
    new CustomEvent('watchlistChanged', {
      detail: { movieData, isAdded },
    })
  );
}

function initializeWatchlistButtons() {
  const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

  // For each movie update all it buttons
  savedWatchlist.forEach((movieData) => {
    const buttons = document.querySelectorAll(
      `[data-movie-id="${movieData.movieId}"]`
    );

    buttons.forEach((button) => {
      button.classList.add('active', 'bg-gray-300');
    });
  });
}

// Add to local storage
// function addMovieToStorage(watchlist) {
//   let watchlistFromStorage;

//   if (localStorage.getItem('watchlist') === null) {
//     watchlistFromStorage = [];
//   } else {
//     watchlistFromStorage = JSON.parse(localStorage.getItem('watchlist'));
//   }

// Add new item to array
//   watchlistFromStorage.push(watchlist);

//   // Convert to JSON string and set to local storage
//   localStorage.setItem('watchlist', JSON.stringify(watchlistFromStorage));
// }

function displayRatingsBackground(sectionEl) {
  ratingsEl = sectionEl.querySelectorAll('.ratings');

  function getRatingClass(ratingText) {
    if (ratingText === 'NA') return 'bg-gray-400';

    const rating = parseFloat(ratingText);
    if (rating >= 75) return 'bg-green-500';
    if (rating >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  }

  ratingsEl.forEach((rating) => {
    const ratingText = rating.textContent.trim();
    rating.classList.add(getRatingClass(ratingText));
  });
}

// Get Movie Genre
async function getGenreName(type, genreId) {
  const data = await fetchAPIData(`genre/${type}/list`);
  const genre = data.genres.find((g) => g.id === genreId);
  return genre ? genre.name : 'Unknown';
}

//
//

// 2. Display 10 most popular Movies

async function displayPopularMovies() {
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

    popularMoviesEl = document.querySelector('#popular-movies');
    popularMoviesEl.appendChild(div);

    displayRatingsBackground(popularMoviesEl);
  });
}

// 3. Display 10 streaming tv shows

async function displayStreamingShows() {
  const { results } = await fetchAPIData('trending/tv/week');

  const recentShows = results
    .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date)) // Sort by newest first
    .slice(0, 15); // Then take first 10 items

  // console.log(results);

  // console.log(recentShows);

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

    streamingEl = document.querySelector('#streaming');
    streamingEl.appendChild(div);

    displayRatingsBackground(streamingEl);
  });
}

// WATCHLIST PAGE

async function displayWatchlistPage() {
  // Get saved watchlist
  const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

  if (savedWatchlist.length === 0) {
    document.querySelector('#watchlist').innerHTML =
      '<p class="text-xl text-lightBlack">Your watchlist is empty.</p>';
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

function displayWatchlistMovieCard(movie, mediaType) {
  const div = document.createElement('div');
  div.classList.add('movie-card');

  div.innerHTML = `<div class="relative">
              <a href="${movie.media_type}-details.html?id=${movie.id}">
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
              } • ${'to be fixed'}</p>
              <button id="movie-card-btn" class="movie-card-watchlist transition-all duration-300" data-movie-id="${
                movie.id
              }" data-media-type=${movie.media_type} href=""
                ><i class="fa-solid fa-square-plus"></i
                ><i class="fa-solid fa-check"></i><span class="not-watchlisted">Add to Watchlist</span><span class="in-watchlist">In Watchlist</span></button
              >
            </div>`;

  const watchlistContainerEl = document.querySelector('#watchlist');

  watchlistContainerEl.appendChild(div);

  displayRatingsBackground(watchlistContainerEl);
}

// Global Functions

// Fetch data from TMDB API

// Register your key at https://www.themoviedb.org/settings/api and
// enter here

// Only use this for development or very small projects.
// You should store your key and make requests from a server

async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  return data;
}

// https://api.themoviedb.org/3/genre/movie/list?language=en

//

// Show spinner

// function showSpinner() {
//   document.querySelector('.spinner').classList.add('show');
// }

// Hide Spinner

// function hideSpinner() {
//   document.querySelector('.spinner').classList.remove('show');
// }

// Highlight Active Link

function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') == global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Add Commas to Number

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get Date
function getDate(date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const release_date = new Date(date);
  return `${
    months[release_date.getMonth()]
  } ${release_date.getDate()}, ${release_date.getFullYear()}`;
}

// Show Alert
// function showAlert(message, className) {
//   const alertEl = document.createElement('div');
//   alertEl.classList.add('alert', className);
//   alertEl.appendChild(document.createTextNode(message));
//   document.querySelector('#alert').appendChild(alertEl);
//   setTimeout(() => alertEl.remove(), 3000);
// }

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/moviekritik-website/dist/index.html':
      displayTrendingMoviesToday();
      displayPopularMovies();
      displayStreamingShows();
      break;

    case '/moviekritik-website/dist/watchlist.html':
      console.log('watchlist page');
      displayWatchlistPage();
      break;
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the app
  init();
  // console.log(watchlistBtn);

  // displayTrendingMoviesToday();
  // displayPopularMovies();
  // displayStreamingShows();
});

// Navigation setup function
// function setupNavigation() {
//   const btn = document.getElementById('menu-btn');
//   const mobileMenu = document.querySelector('.mobile-menu-items');

//   btn.addEventListener('click', function () {
//     btn.classList.toggle('open');
//     mobileMenu.classList.toggle('active');
//   });

//   // Scroll effect for navbar
//   window.addEventListener('scroll', function () {
//     if (window.scrollY > 0) {
//       navbar.classList.add('navbar-scroll');
//     } else {
//       navbar.classList.remove('navbar-scroll');
//     }
//   });
// }

// on click
