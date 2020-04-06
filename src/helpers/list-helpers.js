import {backendUrl, imageUrl} from '@/secrets.js';
import Vue from 'vue';
import store from '@/store/index.js';

function applyQuerySorting(sortingOptions, sortBy, direction) {
	return sortingOptions.find(sortingOption => sortingOption.name == sortBy && sortingOption.direction == parseInt(direction));
}

function setCurrentStoreElement(contentType, element) {
	store.commit('setCurrent' + contentType, element);
}

function getFullImageRoute(festival) {
	return imageUrl + '/' + festival.image[1];
}

function getPlaceholderImage(e) {
	e.target.src = imageUrl + '/images/placeholders/1_M.jpg';
}

// async function getNextElements(context, data, getElementsMethod) {
// 	context.currentPage++;

// 	context.$router.replace({query: {...context.$route.query, page: context.currentPage}});
		
// 	let nextElements = await getElementsMethod(this.currentPage);

// 	// return nextElements;
// 	data = data.concat(nextElements);
// }

// async function getPreviousElements(data, getElementsMethod, previousPage) {
// 	let previousFestivals = await getElementsMethod(previousPage);

// 	data = previousFestivals.concat(data);		
// }

export {applyQuerySorting, setCurrentStoreElement, getFullImageRoute, getPlaceholderImage};