import { fetchAPIData, getGenreName } from './api.js';
import {
  getDate,
  displayRatingsBackground,
  displayBackgroundImage,
  addCommasToNumber,
} from './utils.js';
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
    <button id="movie-card-btn" class="watchlist-btn movie-card-watchlist transition-all duration-300" data-movie-id="${
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
              <button id="movie-card-btn" class="watchlist-btn movie-card-watchlist transition-all duration-300" data-movie-id="${
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

  setTimeout(() => {
    initializeWatchlistButtons();
  }, 1000);
}

// 3. ALL POPULAR MOVIES

// Global variables for pagination
let curPage = 1;
let loadCount = 0;
const maxLoads = 7; // Max number of 'Load more' clicks
let isLoading = false;

export async function displayAllPopularMovies(page = 1, append = false) {
  if (isLoading) return;

  isLoading = true;
  const startTime = Date.now(); // Track when loading starts

  const loadMoreBtn = document.querySelector('#load-more-btn');

  // Update button to loading state
  if (loadMoreBtn) {
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
  }

  try {
    const { results } = await fetchAPIData(`movie/popular`, `${curPage}`);
    console.log(`Page ${page}:`, results);

    // Calculate elapsed time and ensure minimum 2 seconds
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 2000 - elapsedTime);

    // Wait for remaining time if needed
    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

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
              <button id="movie-card-btn" class="watchlist-btn movie-card-watchlist transition-all duration-300" data-movie-id="${
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
  } catch (error) {
    console.error('Error loading movies:', error);
    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Error - Try Again';
    }
  } finally {
    isLoading = false;
    updateLoadMoreButton();
  }
}

// Simple function to update load more button
export function updateLoadMoreButton() {
  const loadMoreBtn = document.querySelector('#load-more-btn');
  if (!loadMoreBtn) return;

  if (loadCount >= maxLoads) {
    // Hide button after maximum loads
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.textContent = `Load More Movies (${
      maxLoads - loadCount
    } remaining)`;
    loadMoreBtn.disabled = false;
  }
}

// Simple load more handler
export function handleLoadMoreMovies() {
  if (loadCount < maxLoads && !isLoading) {
    loadCount++;
    curPage++;
    displayAllPopularMovies(curPage, true); // Append new content
  }
}

// DISPLAY MOVIE DETAILS

export async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  // console.log(movieId);

  const movie = await fetchAPIData(`movie/${movieId}`);

  console.log(movie);

  const { cast } = await fetchAPIData(`movie/${movieId}/credits`);

  const firstFiveCastNames = cast
    .slice(0, 5)
    .map((actor) => actor.name)
    .join(',  ');

  updateMovieTitle(movie.title);
  updateMovieQuickInfo(movie.runtime, movie.genres);
  updateMovieTagline(movie.tagline);
  updateMovieRating(movie.vote_average, movie.vote_count);
  updateMoviePoster(
    `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    movie.title
  );
  updateMovieLink(movie.homepage);
  updateMovieSynopsis(movie.overview);

  // Update the remaining movie details
  const div = document.createElement('div');

  div.classList.add('movie-info-items');

  div.innerHTML = `
  <dl>
                    <div class="item-wrapper">
                      <dt>Release Date</dt>
                      <dd>${getDate(movie.release_date)}</dd>
                    </div><div class="item-wrapper"><dt>Genre</dt>
                      <dd>${movie.genres
                        .map((genre) => genre.name)
                        .join(', ')}</dd>
                    </div>
                    <div class="item-wrapper">
                      <dt>Cast</dt>
                      <dd>${firstFiveCastNames}</dd>
                    </div>
                    <div class="item-wrapper">
                      <dt>Budget</dt>
                      <dd>$${addCommasToNumber(movie.budget)}</dd>
                    </div>
                    <div class="item-wrapper">
                      <dt>Revenue</dt>
                      <dd class="${getRevenueColor(
                        movie.budget,
                        movie.revenue
                      )} font-semibold">$${addCommasToNumber(
    movie.revenue
  )}</dd>
                    </div>
                    <div class="item-wrapper">
                      <dt>Runtime</dt><dd>${Math.floor(movie.runtime / 60)}h ${
    movie.runtime % 60
  }m</dd></div>
                    <div class="item-wrapper">
                      <dt>Status</dt>
                      <dd>${movie.status}</dd>
                    </div>
                    <div class="item-wrapper">
                      <dt>Production ${
                        movie.production_countries.length === 1
                          ? 'Country'
                          : 'Countries'
                      }</dt>
                      <dd>${movie.production_countries
                        .map((country) => `<span>${country.name}</span>`)
                        .join(', ')}</dd>
                    </div>
                    <div class="item-wrapper">
                      <dt>Production ${
                        movie.production_companies.length === 1
                          ? 'Company'
                          : 'Companies'
                      }</dt>
                      <dd>${movie.production_companies
                        .map((company) => `<span>${company.name}</span>`)
                        .join(', ')}</dd>
                    </div>
                  </dl>
  `;

  document.querySelector('.movie-info-details').appendChild(div);

  const btnContainer = document.querySelector('.btn-container');
  if (btnContainer) {
    btnContainer.innerHTML = createWatchlistButton(
      movie.id,
      movie.media_type || 'movie'
    );
  }

  initializeWatchlistButtons();
}

// Helper functions for movie details

function updateMovieTitle(title) {
  document.querySelector('.movie-top-info .movie-title').textContent = title;
}

function updateMovieQuickInfo(runtime, genres) {
  const element = document.querySelector('.movie-top-info .quick-info');
  if (!element) return;

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const time = hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  const genreList = genres.map((g) => g.name || g).join('/');

  element.textContent = `${time}, ${genreList}`;
}

function updateMovieTagline(tagline) {
  document.querySelector('.movie-top-info .tagline').textContent = tagline;
}

function updateMovieRating(rating, reviewCount) {
  // Check if we have reviews
  const hasReviews = reviewCount > 0;

  document.querySelector('.rating-text').textContent = hasReviews
    ? `${Math.round(rating * 10)}%`
    : 'N/A';

  document.querySelector('.review-count-text').textContent = hasReviews
    ? `${reviewCount} Reviews`
    : 'No Reviews';
}

function updateMoviePoster(url, title) {
  const img = document.querySelector('.movie-poster img');
  img.src = url;
  img.alt = `${title}`;
}

function updateMovieSynopsis(text) {
  document.querySelector('.synopsis-text').textContent = text;
}

function updateMovieLink(link) {
  document.querySelector('#movie-homepage a').href = link || '#';
}

function getRevenueColor(budget, revenue) {
  const budgetNum = parseInt(budget) || 0;
  const revenueNum = parseInt(revenue) || 0;
  if (!budgetNum || !revenueNum) return '';

  const ratio = revenueNum / budgetNum;

  if (ratio >= 2.5) return 'revenue-success';
  if (ratio >= 2.0) return 'revenue-good';
  if (ratio >= 1.5) return 'revenue-ok';
  if (ratio >= 1.0) return 'revenue-break-even';
  return 'revenue-loss';
}

function createWatchlistButton(id, mediaType) {
  return `
    <button
      id="movie-card-btn"
      class="watchlist-btn btn-transparent transition-all duration-300"
      data-movie-id="${id}"
      data-media-type="${mediaType}"
      type="button"
    >
      <i class="fa-solid fa-square-plus mr-2"></i>
      <i class="fa-solid fa-check mr-2"></i>
      <span class="not-watchlisted">Add to Watchlist</span>
      <span class="in-watchlist">In Watchlist</span>
    </button>
  `;
}
