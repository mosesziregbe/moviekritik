import { fetchAPIData, getGenreName } from './api.js';
import { getDate, displayRatingsBackground } from './utils.js';
import { initializeWatchlistButtons } from './app.js';

// TRENDING DAY AND WEEK

// Global variables for pagination
let trendingState = {
  day: { curPage: 1, loadCount: 0, isLoading: false },
  week: { curPage: 1, loadCount: 0, isLoading: false },
};

const maxLoads = 4;

export async function displayAllTrending(
  timeWindow = 'day',
  page = 1,
  append = false
) {
  const state = trendingState[timeWindow];
  if (state.isLoading) return;

  state.isLoading = true;
  const startTime = Date.now(); // Track when loading starts

  const loadMoreBtn = document.querySelector('#load-more-btn');

  // Update button to loading state
  if (loadMoreBtn) {
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
  }

  try {
    const { results } = await fetchAPIData(
      `trending/all/${timeWindow}`,
      `${state.curPage}`
    );
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

      // Handle both movies and TV shows from trending/all
      const mediaType = movie.media_type; // 'movie' or 'tv'
      const title = mediaType === 'movie' ? movie.title : movie.name;
      const releaseDate =
        mediaType === 'movie' ? movie.release_date : movie.first_air_date;
      const detailsPage =
        mediaType === 'movie' ? 'movie-details.html' : 'tv-details.html';

      const genreName = await getGenreName('movie', movie.genre_ids[0]);

      div.innerHTML = `<div class="relative">
              <a href="${detailsPage}?id=${movie.id}">
              <div>
            ${
              movie.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}" />`
                : `<img src="images/mk_poster.jpg" class="card-img-top" alt="${title}" />`
            }
            </div>
          </a>
              <span class="ratings absolute rounded top-2 right-2 text-white px-2 py-1 text-sm font-semib old">
                ${
                  movie.vote_average > 0
                    ? `${Math.round(movie.vote_average * 10)}%`
                    : 'NA'
                }
              </span>
            </div>
            <div class="movie-details">
              <p class="movie-card-title">${title}</p>
              <p class="movie-card-date">${getDate(releaseDate)} • ${
        genreName.split(' & ')[0]
      }</p>
              <button id="movie-card-btn" class="watchlist-btn movie-card-watchlist transition-all duration-300" 
                      data-movie-id="${
                        movie.id
                      }" data-media-type="${mediaType}">
                <i class="fa-solid fa-square-plus"></i>
                <i class="fa-solid fa-check"></i>
                <span class="not-watchlisted">Add to Watchlist</span>
                <span class="in-watchlist">In Watchlist</span>
              </button>
            </div>`;

      // Dynamic container based on timeWindow
      const containerId =
        timeWindow === 'day' ? '#trending-day-all' : '#trending-week-all';
      const container = document.querySelector(containerId);
      container.appendChild(div);

      displayRatingsBackground(container);
    });

    setTimeout(() => {
      initializeWatchlistButtons();
    }, 1000);
  } catch (error) {
    console.error(`Error loading trending ${timeWindow}:`, error);
    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Error - Try Again';
    }
  } finally {
    state.isLoading = false;
    updateLoadMoreButton();
  }
}

export function updateLoadMoreButton(timeWindow = 'day') {
  const state = trendingState[timeWindow];
  const loadMoreBtn = document.querySelector('#load-more-btn');
  if (!loadMoreBtn) return;

  if (state.loadCount >= maxLoads) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
    const timeLabel = timeWindow === 'day' ? 'Daily' : 'Weekly';
    loadMoreBtn.textContent = `Load More ${timeLabel} Trending (${
      maxLoads - state.loadCount
    } remaining)`;
    loadMoreBtn.disabled = false;
  }
}

export function handleLoadMoreTrending(timeWindow = 'day') {
  const state = trendingState[timeWindow];
  if (state.loadCount < maxLoads && !state.isLoading) {
    state.loadCount++;
    state.curPage++;
    displayAllTrending(timeWindow, state.curPage, true);
  }
}

// Wrapper functions for backward compatibility
export function displayAllTrendingDay(page = 1, append = false) {
  return displayAllTrending('day', page, append);
}

export function displayAllTrendingWeek(page = 1, append = false) {
  return displayAllTrending('week', page, append);
}
