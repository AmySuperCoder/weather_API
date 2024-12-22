import './styles/jass.css';

const port = process.env.PORT || 3001


const apiBaseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''

const kelvinToF = (tempK: number) => {
  return (9/5)*(tempK - 273) + 32
}

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  const response = await fetch(`${apiBaseURL}/api/weather/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city: cityName }),
  });

  const weatherData = await response.json();

  console.log('weatherData: ', weatherData);

  renderCurrentWeather(weatherData?.data?.current);
  renderForecast(weatherData?.data?.forecast);
};

const fetchSearchHistory = async () => {
  const historyRes = await fetch(`${apiBaseURL}/api/weather/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
const historyResJson = await historyRes.json()
console.log(historyResJson)
  return historyResJson?.data
};

const deleteCityFromHistory = async (id: string) => {
  const deleteRes = await fetch(`${apiBaseURL}/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
const deleteResJson = await deleteRes.json()
console.log(deleteResJson)
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
      const today = new Date()

    const formattedToday = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`

    

  
  heading.textContent = `${currentWeather.name} (${formattedToday})`;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`
  );
  weatherIcon.setAttribute('alt', currentWeather.weather[0].description);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${Math.floor(kelvinToF(currentWeather.main.temp))}°F`;
  windEl.textContent = `Wind: ${currentWeather.wind.speed} MPH`;
  humidityEl.textContent = `Humidity: ${currentWeather.main.humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any): void => {
  const today = new Date()
  const todayMonth = today.getMonth()+1 
  const formattedTodayMonth = todayMonth<10 ? `0${todayMonth}` : todayMonth
   const todayDate = today.getDate()<10 ? `0${today.getDate()}` : today.getDate()
   const todayYear = today.getFullYear()
   const compareToday = `${todayYear}-${todayMonth}-${todayDate}`
  const forecastList = forecast.list
  const forecastFuture = forecastList.filter((listItem: any) => {
    return !listItem.dt_txt.includes(compareToday)
  })

console.log(forecastFuture.map((listItem: any) => listItem.dt_txt))

  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }
const forecastFutureNoon = forecastFuture.slice(4)
  for (let i = 0; i < forecastFutureNoon.length; i+=8) {
    console.log(forecastFutureNoon[i])
    renderForecastCard(forecastFutureNoon[i]);
  }
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
    createForecastCard();

  const forecastDate = new Date(forecast.dt_txt)
  console.log(forecastDate)
  const todayMonth = forecastDate.getMonth()+1 
  const formattedTodayMonth = todayMonth<10 ? `0${todayMonth}` : todayMonth
   const todayDate = forecastDate.getDate()<10 ? `0${forecastDate.getDate()}` : forecastDate.getDate()
   const todayYear = forecastDate.getFullYear()
  const formattedForecastDate = `${formattedTodayMonth}/${todayDate}/${todayYear}`

  // Add content to elements
  cardTitle.textContent = formattedForecastDate
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`
  );
  weatherIcon.setAttribute('alt', forecast.weather[0].description);
  tempEl.textContent = `Temp: ${Math.floor(kelvinToF(forecast.main.temp))} °F`;
  windEl.textContent = `Wind: ${forecast.wind.speed} MPH`;
  humidityEl.textContent = `Humidity: ${forecast.main.humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async (searchHistory: any) => {
  

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!searchHistory.length) {
      searchHistoryContainer.innerHTML =
        '<p class="text-center">No Previous Search History</p>';
    }

    // * Start at end of history array and count down to show the most recent cities at the top.
    for (let i = searchHistory.length - 1; i >= 0; i--) {
      const historyItem = buildHistoryListItem(searchHistory[i]);
      searchHistoryContainer.append(historyItem);
    }
  }
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  if (!searchInput.value) {
    throw new Error('City cannot be blank');
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city).then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
