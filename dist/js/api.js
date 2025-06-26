export const global = {
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

// Fetch data from TMDB API

// Register your key at https://www.themoviedb.org/settings/api and
// enter here

// Only use this for development or very small projects.
// You should store your key and make requests from a server

export async function fetchAPIData(endpoint, page = 1) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// GET MOVIE GENRE
export async function getGenreName(type, genreId) {
  const data = await fetchAPIData(`genre/${type}/list`);
  const genre = data.genres.find((g) => g.id === genreId);
  return genre ? genre.name : 'Unknown';
}

// Show spinner

function showSpinner() {
  document.querySelector('#spinnerOverlay').classList.remove('hidden');
}

// Hide Spinner

function hideSpinner() {
  document.querySelector('#spinnerOverlay').classList.add('hidden');
}
