const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    pagitaion: 1,
    totalPages: 1,
  },
  api: {
    apiKey: "c9293e4ce5fe1fce429e0527afea0e25",
    apiURL: "https://api.themoviedb.org/3/",
  },
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

  displayBackgroundImage("movie", movie.backdrop_path);

  const movieDetailsDiv = `
        <div class="details-top">
          <div>
            <img
            src=${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
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

const displayShowDetails = async () => {
  const showID = document.location.search.split("=")[1];
  const show = await fetchAPIData(`tv/${showID}`);

  displayBackgroundImage("tvShow", show.backdrop_path);

  const showDetailsDiv = `
  <div class="details-top">
  <div>
    <img
      src=${
        show.poster_path
          ? `https://image.tmdb.org/t/p/w500/${show.poster_path}`
          : "images/no-image.jpg"
      }
      class="card-img-top"
      alt="${show.name}"
    />
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Air Date: ${show.first_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${
        show.last_episode_to_air.name
      }
    </li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${show.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ")}</div>
</div>
    `;

  document
    .querySelector("#show-details")
    .insertAdjacentHTML("afterbegin", showDetailsDiv);
};

const search = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if ((global.search.term !== "") & (global.search.term !== null)) {
    const results = await searchAPIData();
    console.log(results);
  } else {
    showAlert("Please search a term");
  }
};

const displayBackgroundImage = (type, backgroundPath) => {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.15";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
};

const displaySlider = async () => {
  const { results } = await fetchAPIData("movie/now_playing");
  const wrapper = document.querySelector(".swiper-wrapper");

  results.forEach((movie) => {
    const slide = `
    <div class="swiper-slide">
        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
            1
          )} / 10
        </h4>
    </div>   
    `;
    wrapper.insertAdjacentHTML("afterbegin", slide);

    initSwiper();
  });
};

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 8000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
};

const fetchAPIData = async (endpoint) => {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`);
  const data = await response.json();

  removeSpinner();

  return data;
};

const searchAPIData = async () => {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&query=${global.search.term}`
  );
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

const showAlert = (message, className) => {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", "className");
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
};

const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const init = () => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }
  highlightActiveLink();
};

document.addEventListener("DOMContentLoaded", init);
