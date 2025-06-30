import { global, searchAPIData } from './api.js';
import { showAlert } from './utils.js';

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

  if (!data || !data.results || data.results.length === 0) {
    showAlert('No results found');
    return;
  }

  console.log('Search results:', data);
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
