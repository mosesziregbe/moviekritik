// Add Commas to Number

export function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get Date
export function getDate(date) {
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

// DISPLAY RATINGS BACKGROUND
export function displayRatingsBackground(sectionEl) {
  const ratingsEl = sectionEl.querySelectorAll('.ratings');

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

// DISPLAY BACKDROP ON DETAILS PAGE

export function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;

  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('.movie-top').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}
