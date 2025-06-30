import { global, searchAPIData, getGenreName } from './api.js';
import { displayRatingsBackground, getDate, showAlert } from './utils.js';

// SEARCH MOVIES/SHOWS

const searchInput = document.querySelector('.search-input');
const searchTypeSelect = document.querySelector('.search-type-select');
const searchIcon = document.querySelector('.search-icon');

export async function search() {
  const urlParams = new URLSearchParams(window.location.search);
  const term = urlParams.get('search-term');
  const type = urlParams.get('search-type');

  let endpoint;
  if (type === 'movie') endpoint = 'search/movie';
  else if (type === 'tv') endpoint = 'search/tv';

  if (!term) {
    alert('Please enter a search term');
    return;
  }

  // Set global search term
  global.search.term = term;
  global.search.type = type;
  global.search.page = 1;

  const data = await searchAPIData();

  const { results, total_pages, page, total_results } = await searchAPIData();

  // console.log(results);

  global.search.page = page;
  global.search.totalPages = total_pages;
  global.search.totalResults = total_results;

  if (!data || !data.results || data.results.length === 0) {
    showAlert('No results found');
    return;
  }

  console.log('Search results:', data);

  displaySearchResults(results);
}

export function initializeSearch() {
  if (!searchInput || !searchIcon) return;

  // On Enter Key press in input

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      triggerSearch(searchInput.value);
    }
  });

  // On clicking the search icon
  searchIcon.addEventListener('click', () => {
    triggerSearch(searchInput.value);
  });
}

function triggerSearch() {
  let term = searchInput.value.trim();
  const type = searchTypeSelect.value;

  if (!term) {
    alert('Please enter a search term');
    return;
  }

  // Redirect to search.html with query param
  window.location.href = `search.html?search-term=${encodeURIComponent(
    term
  )}&search-type=${type}`;
}

// DISPLAY SEARCH RESULTS

function displaySearchResults(results) {
  // Clear Previous results

  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach(async (result) => {
    // Create a div
    const div = document.createElement('div');

    // Add the classname - 'movie-card'
    div.classList.add('movie-card');

    const mediaType = result.media_type; // 'movie' or 'tv'
    const title = mediaType === 'movie' ? result.title : result.name;
    const releaseDate =
      mediaType === 'movie' ? result.release_date : result.first_air_date;
    const detailsPage =
      mediaType === 'movie' ? 'movie-details.html' : 'tv-details.html';

    const genreName = await getGenreName('movie', result.genre_ids[0]);

    div.innerHTML = `<div class="relative">
                  <a href="${detailsPage}?id=${result.id}">
                  <div>
                ${
                  result.poster_path
                    ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${title}" />`
                    : `<img src="images/mk_poster.png" class="card-img-top" alt="${title}" />`
                }
                </div>
              </a>
                  <span class="ratings absolute rounded top-2 right-2 text-white px-2 py-1 text-sm font-semib old">
                    ${
                      result.vote_average > 0
                        ? `${Math.round(result.vote_average * 10)}%`
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
                            result.id
                          }" data-media-type="${mediaType}">
                    <i class="fa-solid fa-square-plus"></i>
                    <i class="fa-solid fa-check"></i>
                    <span class="not-watchlisted">Add to Watchlist</span>
                    <span class="in-watchlist">In Watchlist</span>
                  </button>
                </div>`;

    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;

    const searchContainerEl = document.querySelector('#search-results');

    searchContainerEl.appendChild(div);

    displayRatingsBackground(searchContainerEl);
  });

  displayPagination();
}

// CREATE AND DISPLAY PAGINATION FOR SEARCH
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
          <button class="btn-primary" id="prev">Prev</button>
          <button class="btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
        `;

  document.querySelector('#pagination').appendChild(div);

  // Disable preview button if on first page

  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Previous page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}
