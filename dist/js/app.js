import { fetchAPIData, global, getGenreName } from './api.js';
import {
  displayAllPopularShows,
  displayStreamingShows,
  handleLoadMoreShows,
} from './shows.js';
import { displayWatchlistPage, checkWatchlistPage } from './watchlist.js';
import {
  displayTrendingMoviesToday,
  displayAllPopularMovies,
  handleLoadMoreMovies,
  displayPopularMovies,
  displayMovieDetails,
  displayShowDetails,
} from './movies.js';

import {
  displayAllTrendingDay,
  displayAllTrendingWeek,
  handleLoadMoreTrending,
} from './trending.js';
import { initializeSearch, search } from './search.js';

//
//

// Event listener for watchlist button

document.addEventListener('click', function (e) {
  if (e.target.closest('.watchlist-btn')) {
    const movieId = e.target.closest('.watchlist-btn').dataset.movieId;
    const mediaType = e.target.closest('.watchlist-btn').dataset.mediaType;

    const button = e.target.closest('.watchlist-btn');

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

  // Update each button
  buttons.forEach((button) => {
    if (isAdded) {
      button.classList.add('active', 'bg-gray-200', 'text-blue-950');
    } else {
      button.classList.remove('active', 'bg-gray-200', 'text-blue-950');
    }

    // REMOVE THE MOVIE CARD FROM WATCHLIST PAGE
    if (window.location.pathname.includes('watchlist')) {
      if (confirm('Are you sure?')) {
        button.closest('.movie-card').remove();
      }

      // Check if watchlist is empty
      checkWatchlistPage();
    }
  });
});

// Broadcast Change
function broadcastWatchlistChange(movieData, isAdded) {
  document.dispatchEvent(
    new CustomEvent('watchlistChanged', {
      detail: { movieData, isAdded },
    })
  );
}

// Initialize watchlist Buttons
export function initializeWatchlistButtons() {
  const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

  // For each movie update all it buttons
  savedWatchlist.forEach((movieData) => {
    const buttons = document.querySelectorAll(
      `[data-movie-id="${movieData.movieId}"]`
    );

    buttons.forEach((button) => {
      button.classList.add('active', 'bg-gray-200', 'text-blue-950');
    });
  });
}

// Event Listener for Load More Button - Movies All, Shows All
const loadMoreButton = document.getElementById('load-more-btn');

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', function () {
    const mediaType = this.dataset.mediaType;
    const timeWindow = this.dataset.timeWindow;

    if (timeWindow) {
      handleLoadMoreTrending(timeWindow);
    } else if (mediaType === 'movie') {
      handleLoadMoreMovies();
    } else if (mediaType === 'tv') {
      handleLoadMoreShows();
    }
  });
}

// Search button Interactive behavior - All Pages
const searchInputs = document.querySelectorAll('.search-input');

searchInputs.forEach((input) => {
  input.addEventListener('focus', function () {
    this.parentElement.style.transform = 'scale(1.02)';
    this.parentElement.style.transition = 'transform 0.2s ease';
  });

  input.addEventListener('blur', function () {
    this.parentElement.style.transform = 'scale(1)';
  });
});

//
//

//
//

// Highlight Active Link

function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') == global.currentPage) {
      link.classList.add('active');
    }
  });
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
  initializeSearch();

  switch (global.currentPage) {
    // Homepage
    case '/':
    case '/moviekritik-website/dist/index.html':
      displayTrendingMoviesToday();
      displayPopularMovies();
      displayStreamingShows();
      break;

    // Watchlist page
    case '/moviekritik-website/dist/watchlist.html':
    case '/watchlist.html':
    case '/watchlist':
      console.log('watchlist page');
      displayWatchlistPage();
      break;

    // Popular Movies Page
    case '/moviekritik-website/dist/movies.html':
      console.log('movies page');
      displayAllPopularMovies();
      break;

    // Popular TV Shows Page
    case '/moviekritik-website/dist/tv-shows.html':
      console.log('shows page');
      displayAllPopularShows();
      break;

    // Trending (Day/Week) Pages
    case '/moviekritik-website/dist/trending-today.html':
      console.log('trending today page');
      displayAllTrendingDay();
      break;

    // Movie Details page

    case '/moviekritik-website/dist/movie-details.html':
    case '/movie-details.html':
      console.log('movie details page');
      displayMovieDetails();
      break;

    // TV Details page

    case '/moviekritik-website/dist/tv-details.html':
    case '/tv-details.html':
      console.log('tv details page');
      displayShowDetails();
      break;

    // Search page

    case '/moviekritik-website/dist/search.html':
    case '/search.html':
      console.log('search page');
      search();
      break;
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the app
  init();
});
