'use strict';

console.log('Starting script');

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const divCat = document.querySelector('.cat-info');
let select;

Notiflix.Notify.init({ position: 'right-top', timeout: 3000 });

divCat.style.display = 'none';

window.onload = () => {
  console.log('Window loaded');

  Notiflix.Loading.standard('Loading data, please wait...', {
    backgroundColor: 'rgba(0,0,0,0.8)',
  });

  fetchBreeds()
    .then(breeds => {
      Notiflix.Loading.remove();
      const breedSelect = document.querySelector('.breed-select');
      select = new SlimSelect({
        select: breedSelect,
        data: breeds.map(breed => ({
          text: breed.name,
          value: breed.id,
        })),
      });
      breedSelect.addEventListener('change', event => {
        console.log('onChange event', event);
        console.log('onChange event - selected value', event.target.value);
        displayCatInfo(event.target.value);
      });
      console.log('SlimSelect initialized: ', select);
      console.log('SlimSelect data: ', select.data.getData());
    })
    .catch(error => {
      Notiflix.Loading.remove();

      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
};

function displayCatInfo(breedId) {
  console.log('About to fetch cat by breed');

  Notiflix.Loading.standard('Loading data, please wait...', {
    backgroundColor: 'rgba(0,0,0,0.8)',
  });

  fetchCatByBreed(breedId)
    .then(cat => {
      console.log('Fetched cat info', cat);
      Notiflix.Loading.remove();
      console.log(cat);
      divCat.innerHTML = `
                <div class="cat-info">
    <img src="${cat.url}" alt="${cat.breeds[0].name}" class="cat-image">
    <div class="description">
        <h2>${cat.breeds[0].name}</h2>
        <p>${cat.breeds[0].description}</p>
        <p>${cat.breeds[0].temperament}</p>
    </div>
</div>
            `;
      console.log(divCat);

      divCat.style.display = 'block';
    })
    .catch(error => {
      Notiflix.Loading.remove();
      console.error(error);

      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
}
