const APILINK =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=de16e79b859e1464de0266fc87b493a7&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=de16e79b859e1464de0266fc87b493a7&query=";

const main = document.getElementById("mainSection");
const form = document.getElementById("form");
const search = document.getElementById("searchbox");

returnMovies(APILINK);

function returnMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      main.innerHTML = ""; // clear previous content
      const div_row = document.createElement("div");
      div_row.classList.add("row");

      data.results.forEach((element) => {
        const div_column = document.createElement("div");
        div_column.classList.add("column");

        const div_card = document.createElement("div");
        div_card.classList.add("card");

        const image = document.createElement("img");
        image.classList.add("thumbnail");
        image.src = element.poster_path
          ? IMG_PATH + element.poster_path
          : "img/imageNotFound.avif";

        image.addEventListener("click", () => {
          // Basic info
          document.getElementById("modalTrailer").style.display = "block";
          document.getElementById("noTrailerMessage")?.remove(); // Remove old message if any

          document.getElementById("modalImage").src = image.src;
          document.getElementById("modalTitle").textContent = element.title;
          document.getElementById("modalOverview").textContent =
            element.overview || "No overview available.";
          document.getElementById(
            "modalRating"
          ).textContent = `⭐ Rating: ${element.vote_average.toFixed(1)}`;
          document.getElementById(
            "modalReleaseDate"
          ).textContent = `📅 Released: ${new Date(
            element.release_date
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`;

          // New trailer fetch
          fetch(
            `https://api.themoviedb.org/3/movie/${element.id}/videos?api_key=de16e79b859e1464de0266fc87b493a7`
          )
            .then((res) => res.json())
            .then((data) => {
              const trailer = data.results.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
              );

              const trailerFrame = document.getElementById("modalTrailer");
              if (trailer) {
                trailerFrame.src = `https://www.youtube.com/embed/${trailer.key}`;
              } else {
                trailerFrame.src = "";
                document.getElementById("modalTrailer").style.display = "none";
                document
                  .getElementById("modalTrailerContainer")
                  .insertAdjacentHTML(
                    "beforeend",
                    '<p id="noTrailerMessage">No trailer available.</p>'
                  );
              }
            });

          // Show the modal
          document.getElementById("movieModal").style.display = "block";
        });

        const title = document.createElement("h3");
        title.textContent = element.title;

        const rating = document.createElement("span");
        rating.textContent = `⭐ ${element.vote_average.toFixed(1)}`;

        const releaseDate = document.createElement("span");
        const readableDate = new Date(element.release_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        releaseDate.textContent = readableDate;

        div_card.appendChild(image);
        div_card.appendChild(title);
        div_card.appendChild(releaseDate);
        div_card.appendChild(rating);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);
      });

      main.appendChild(div_row); //Append row once, after loop
    });
}

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   main.innerHTML = "";

//   const searchItem = search.value;
//   if (searchItem) {
//     returnMovies(SEARCHAPI + searchItem);
//     search.value = "";
//   }
// });

//------------------
document.getElementById("searchbox").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("searchButton").click();
  }
});

document.getElementById("searchButton").addEventListener("click", () => {
  main.innerHTML = "";

  const query = document.getElementById("searchbox").value;
  const year = document.getElementById("yearFilter").value;
  const language = document.getElementById("languageFilter").value;
  const rating = document.getElementById("ratingFilter").value;
  const order = document.getElementById("orderFilter").value;
  const genreOptions = document.getElementById("genreFilter").selectedOptions;
  const selectedGenres = Array.from(genreOptions).map((opt) => opt.value);

  let url = "";

  if (query) {
    url = `${SEARCHAPI}${encodeURIComponent(query)}`;
  } else {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=de16e79b859e1464de0266fc87b493a7`;

    if (order) url += `&sort_by=${order}`;
    if (year) url += `&primary_release_year=${year}`;
    if (language) url += `&with_original_language=${language}`;
    if (selectedGenres.length > 0)
      url += `&with_genres=${selectedGenres.join(",")}`;
    if (rating) url += `&vote_average.gte=${rating}`;
  }

  returnMovies(url);
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modalTrailer").src = "";
  document.getElementById("movieModal").style.display = "none";
});

//close when clicking outside modal content
window.addEventListener("click", (event) => {
  const modal = document.getElementById("movieModal");
  if (event.target === modal) {
    document.getElementById("modalTrailer").src = "";
    modal.style.display = "none";
  }
});
