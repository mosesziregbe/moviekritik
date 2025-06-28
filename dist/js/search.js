import { global, searchAPIData } from './api.js';
import { showAlert } from './utils.js';

// SEARCH MOVIES/SHOWS

export async function search() {
  const urlParams = new URLSearchParams(window.location.search);
  const term = urlParams.get('search-term');

  if (!term) {
    alert('Please enter a search term');
    return;
  }

  // Set global search term
  global.search.term = term;
  global.search.page = 1;

  const data = await searchAPIData();

  if (!data || !data.results || data.results.length === 0) {
    showAlert('No results found');
    return;
  }

  console.log('Search results:', data);
}

export function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchIcon = document.querySelector('.search-icon');

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

function triggerSearch(term) {
  const trimmedTerm = term.trim();

  if (trimmedTerm === '') {
    alert('Please enter a search term');
    return;
  }

  // Redirect to search.html with query param
  window.location.href = `search.html?search-term=${encodeURIComponent(
    trimmedTerm
  )}`;
}
