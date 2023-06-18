const auth = "wVHU4MaGm55RUWH2N4edkrUPmCneZw4yfi40WSkCNIp5F6YzkBDmLsW7";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search_input");
const form = document.querySelector(".btn_search");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

searchInput.addEventListener("input", updateInput);
form.addEventListener("click", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

function updateInput(e) {
  searchValue = e.target.value;
}

more.addEventListener("click", loadMoreImages);

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

async function generateImages(data) {
  data.photos.forEach((photo) => {
    const galleryImage = document.createElement("div");
    galleryImage.classList.add("gallery-image");
    galleryImage.innerHTML = `
      <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
      </div>
      <img src=${photo.src.large} alt="image"></img>`;
    gallery.appendChild(galleryImage);
  });
}

async function curatedPhotos() {
  const data = await fetchApi(
    `https://api.pexels.com/v1/curated?per_page=15&page=1`
  );
  generateImages(data);
}

async function searchPhotos(query) {
  clean();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  generateImages(data);
}

function clean() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMoreImages() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generateImages(data);
}

curatedPhotos();
