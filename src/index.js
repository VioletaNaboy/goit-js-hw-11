import axios from 'axios';
import { Notify } from 'notiflix';
const searchInput = document.querySelector('[name="searchQuery"]');
const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let numberOfPage = 1;
let clickCount = 0;
let totalOfFotos = 40;
searchForm.addEventListener('submit', createGallery);
async function createGallery(event) {
  await event.preventDefault();
  if (searchInput.value && searchInput.value != ' ') {
    await reset();
    try {
      const response = await getItems(numberOfPage);
      if (response.data.hits.length) {
        await addFoto(response);
        await loadMoreBtn.addEventListener('click', () => {
          loadMoreBtn.classList.add('hidden');
          clickCount++;
          totalOfFotos += response.data.hits.length;
          addAdditionFoto(response);
        });
      } else {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  } else {
    Notify.failure('Please enter something');
  }
}
async function getItems(numberOfPage) {
  const query = searchInput.value;
  const baseUrl = `https://pixabay.com/api/?key=36982063-09f5e87e06cdb5f9f4765ffc0&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
  const response = await axios.get(`${baseUrl}&page=${numberOfPage}`);
  return response;
}
async function addAdditionFoto(response) {
  if (totalOfFotos < response.data.totalHits) {
    pageNext = 1 + clickCount;
    const responseNew = await getItems(pageNext);
    await addFoto(responseNew);

    return pageNext;
  } else {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    await loadMoreBtn.classList.add('hidden');
  }
}
async function addFoto(response) {
  const foto = await response.data.hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="250px"/>
  <div class="info">
    <p class="info-item">
      <b>Likes </b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views </b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments </b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads </b><span>${downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  await loadMoreBtn.classList.remove('hidden');
  return gallery.insertAdjacentHTML('beforeend', foto);
}
async function reset() {
  totalOfFotos = 40;
  clickCount = 0;
  gallery.innerHTML = '';
  await loadMoreBtn.classList.add('hidden');
}
