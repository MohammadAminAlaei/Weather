
const RECENT_SEARCH = 'SEARCH_CITIES';

const debounced = _.debounce(searchCities, 500)

function handleInputChange() {
    debounced();
}

async function searchCities(event) {
    const searchInputElement = document.getElementsByClassName('search__input')[0];
    const foundedCities = await getCities(searchInputElement.value);
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];

    toggleSuggestion(searchInputElement.value.length);

    if (foundedCities.length) {
        loadSuggestion(foundedCities)
        setRecentSearch(foundedCities);
    } else {
        const emptyElement = `<div class="empty__message"> ${searchInputElement.value.value} is Not Founded... Please Search Another Cites </div>`;
        suggestionElement.innerHTML = emptyElement
    }

}

function handleInputBlur() {
    setTimeout(() => toggleSuggestion(false), 100)
}

function handleInputFocus() {
    const recentCities = JSON.parse(localStorage.getItem(RECENT_SEARCH));
    if (recentCities && recentCities.length) {
        loadSuggestion(recentCities);
        toggleSuggestion(true);
    }
}

async function selectCity(city) {
    const inputElement = document.getElementsByClassName('search__input')[0];
    inputElement.value = city.name;
    const response = getCurrentWeather(city.id)
}

function loadSuggestion(cities) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];
    const items = document.getElementsByName('search__items')[0];
    items && items.remove();
    const ul = document.createElement('UL');
    ul.classList.add('search__items');
    cities.forEach(city => {
        const element = document.createElement('LI');
        element.style.cursor = 'pointer';
        element.style.padding = '.5rem 0';
        element.classList.add('search__item');
        element.onclick = () => selectCity(city);
        element.innerText = city.name;
        ul.appendChild(element)
    })
    suggestionElement.appendChild(ul);

}

function toggleSuggestion(isShow) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];
    isShow ?
        suggestionElement.classList.add('search__suggestion--active') :
        suggestionElement.classList.remove('search__suggestion--active');

    !isShow && (() => {
        suggestionElement.innerHTML = '';
    })()
}

function setRecentSearch(cities) {
    let data = cities.slice(0, 4);
    data = JSON.stringify(data);
    localStorage.setItem(RECENT_SEARCH, data)
}

