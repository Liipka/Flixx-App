const global = {
  currentPage: window.location.pathname,
};

const highlightActiveLink = () => {
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.toggle("active");
    }
  });
};

const displayPopularMovies = async () => {
  const { results } = await fetchAPIData("movie/popular");

  const popularMoviesGird = document.querySelector("#popular-movies");
  results.forEach((movie) => {
    const card = `
        <div class="card">
          <a href="movie-details.html?id=${movie.id}">
            <img
              src=${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "images/no-image.jpg"
              }
              class="card-img-top"
              alt='${movie.title}'
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        </div>
    `;

    popularMoviesGird.insertAdjacentHTML("afterbegin", card);
  });
};

const displayPopularShows = async () => {
  const { results } = await fetchAPIData("tv/popular");

  const popularShowsGird = document.querySelector("#popular-shows");
  results.forEach((show) => {
    const card = `
          <div class="card">
            <a href="tv-details.html?id=${show.id}">
              <img
                src=${
                  show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : "images/no-image.jpg"
                }
                class="card-img-top"
                alt='${show.name}'
              />
            </a>
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">
                <small class="text-muted">Air Date: ${
                  show.first_air_date
                }</small>
              </p>
            </div>
          </div>
      `;

    popularShowsGird.insertAdjacentHTML("afterbegin", card);
  });
};

const displayMovieDetails = async () => {
  const movieID = document.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${movieID}`);

  console.log(movie);

  const movieDetailsDiv = `
        <div class="details-top">
          <div>
            <img
            src=${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "images/no-image.jpg"
            }
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${movie.genres
                  .map((genre) => `<li>${genre.name}</li>`)
                  .join("")}

            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(", ")}</div>
        </div>
  `;

  document
    .querySelector("#movie-details")
    .insertAdjacentHTML("afterbegin", movieDetailsDiv);
};

const fetchAPIData = async (endpoint) => {
  const API_KEY = "c9293e4ce5fe1fce429e0527afea0e25";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`);
  const data = await response.json();

  removeSpinner();

  return data;
};

const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
};

const removeSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
};

const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const init = () => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      console.log("TV details");
      break;
    case "/search.html":
      console.log("Search");
      break;
  }
  highlightActiveLink();
};

document.addEventListener("DOMContentLoaded", init);
