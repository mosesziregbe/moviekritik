import { fetchAPIData, global, getGenreName } from './api.js';
import { displayAllPopularShows, displayStreamingShows } from './shows.js';
import { displayWatchlistPage, checkWatchlistPage } from './watchlist.js';
import {
  displayTrendingMoviesToday,
  displayAllPopularMovies,
  displayPopularMovies,
} from './movies.js';

// Event listener for watchlist button

document.addEventListener('click', function (e) {
  if (e.target.closest('.movie-card-watchlist')) {
    const movieId = e.target.closest('.movie-card-watchlist').dataset.movieId;
    const mediaType = e.target.closest('.movie-card-watchlist').dataset
      .mediaType;

    const button = e.target.closest('.movie-card-watchlist');

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

//
//

// Add some interactive behavior
const searchInputs = document.querySelectorAll('.search-input');

searchInputs.forEach((input) => {
  input.addEventListener('focus', function () {
    this.parentElement.style.transform = 'scale(1.05)';
    this.parentElement.style.transition = 'transform 0.2s ease';
  });

  input.addEventListener('blur', function () {
    this.parentElement.style.transform = 'scale(1)';
  });
});

// 7. TRENDING MOVIES TODAY

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
  switch (global.currentPage) {
    case '/':
    case '/moviekritik-website/dist/index.html':
      displayTrendingMoviesToday();
      displayPopularMovies();
      displayStreamingShows();
      break;

    case '/moviekritik-website/dist/watchlist.html':
    case '/watchlist.html':
    case '/watchlist':
      console.log('watchlist page');
      displayWatchlistPage();
      break;

    case '/moviekritik-website/dist/movies.html':
      console.log('movies page');
      displayAllPopularMovies();
      break;

    case '/moviekritik-website/dist/tv-shows.html':
      console.log('shows page');
      displayAllPopularShows();
      break;
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the app
  init();
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
