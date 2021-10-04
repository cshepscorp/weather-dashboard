var citySearchFormEl = document.querySelector("#city-form"); // search area's form id
var cityInputEl = document.querySelector("#citysearch"); // input area's  id

var cityButtons = document.querySelector("#city-buttons"); //
var savedCityButtonEl = document.querySelectorAll(".saved-city"); // search area's form id

var chosenCitySearchTerm = document.querySelector("#city-search-term");
var chosenCityData = document.querySelector("#citysearch");
var currentWeatherEl = document.querySelector("#current-weather");
var currentWeatherDivEl = document.querySelector('#current-weather-div');
var uvIndexEl = document.querySelector("#uv-index");
var forecastContainerEl = document.querySelector("#forecast-container");

// date stuff
var currentTime = document.querySelector("#current-time");
var currentMomentTime = moment().format('L');
currentTime.textContent = (`(${currentMomentTime})`);

var getSearchedCity = function(city) {
  // format the github api url

  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&standard&appid=dbafc1b1b5a7f951673e49ae6a6bdea5";
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
    response.json().then(function(data) {
      displayCurrentWeather(data, city);
      uvIndex();
      });
    } else {
      console.log('something went wrong');
    }
  });

};


var formSubmitHandler = function(event) {
  event.preventDefault();

  // get city value from what user input
  var city = cityInputEl.value.trim();
  if(city) {  
    getSearchedCity(city);
    cityInputEl.value = "";

    // stops program from creating an empty button when user doesn't input a city
    var cityButtonValue = city;

    var cityButton = document.createElement('button');
    cityButton.classList = 'btn btn-secondary saved-city';
    cityButton.textContent = cityButtonValue;
    cityButton.setAttribute('id', cityButtonValue);
    cityButton.setAttribute('type', 'submit');

    cityButtons.append(cityButton);

    // save to localStorage
    var savedCityButtons = localStorage.getItem("saved city buttons");
    var savedCities;
    
    // if there are no saved scores, create array to save them
    if(savedCityButtons === null) {
      savedCities = [];
    } else {
      // use JSON.parse to allow array to save stringified values 
      savedCities = JSON.parse(savedCityButtons);
    }
    var savedCityButton = {
      name: city
    };

    savedCities.push(savedCityButton);

    // use JSON.stringify to allow local storage to save values 
    var savedCitiesString = JSON.stringify(savedCities);
    window.localStorage.setItem("saved city buttons", savedCitiesString)

  } else {
    alert("Please enter a valid city name")
  }
};

var savedCityEventHandler = function() {
  console.log('savedCityEventHandler is loaded')
};

// display UV index
var uvIndex = function(response){
  city = document.getElementById("city-search-term").textContent;
  // get lat and lon from this API so we can use in diff API call to get UV Index
  var currentApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
    + city + 
    '&appid=dbafc1b1b5a7f951673e49ae6a6bdea5';
  fetch(currentApiUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    // applies lat and lon to the API that allows us to pull in UV Index
    var cityLon = response.coord.lon;
    var cityLat = response.coord.lat;

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='
    + cityLat +
    '&lon='
    + cityLon +
    '&appid=dbafc1b1b5a7f951673e49ae6a6bdea5')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      // uvIndex
      var uvIndexValue = response.current.uvi;
      // alerts user to appropriate level of uvIndex rating: safe, potentially unsafe or dangerous
      if (uvIndexValue < 3) {
        uvRating = 'btn-success' 
      } else if (uvIndexValue >= 3 && uvIndexValue < 8) { 
        uvRating = 'btn-warning'
      } else {
        uvRating = 'btn-danger'
      }
      uvIndexEl.innerHTML = `<li style="margin-left: 10px;">UV Index: <button class="${uvRating} uv-btn disabled">${uvIndexValue}</button></li>`;
    })
  })
  
} 

var loadCityButtons = function() {
  var savedCityButtons = localStorage.getItem("saved city buttons");
  console.log(typeof savedCityButtons); // string

  // are there any cities saved in LS?
  if (savedCityButtons === null) {
    return;
  } 

  var savedCityButtonItems = JSON.parse(savedCityButtons);
  
    for (var i = 0; i < savedCityButtonItems.length; i++) {
      var newCityButton = document.createElement('button');
      newCityButton.classList = 'btn btn-secondary saved-city';
      console.log('savedcitybtn items: ' + savedCityButtonItems);
      // savedCityButtonItems = JSON.stringify(savedCityButtonItems);
      newCityButton.textContent = savedCityButtonItems[i].name;
      newCityButton.setAttribute('id', savedCityButtonItems[i].name);
      newCityButtonName = savedCityButtonItems[i].name;
      newCityButton.setAttribute('type', 'submit');

      cityButtons.append(newCityButton);
      
    }
  
}

$(document).on('click','.saved-city',function(){
  event.preventDefault();
  
  var cityButton = $(this).attr("id");
  console.log(cityButton + ' is from new event listener');
  getSearchedCity(cityButton);
});

function savedCities() {

  // function attached to dynamically generated city buttons when user searches
  var newCity;  
  newCity = $(this).attr("id");
  getSearchedCity(newCity);

}

function loadSavedCities() {
  // loads saved city buttons
  city = savedCity.textContent;
  getSearchedCity();

}

var displayCurrentWeather = function(weather, searchTerm){
  // clear old content
  chosenCityData.textContent = "";
  chosenCitySearchTerm.textContent = searchTerm;
  console.log('is chosen city: ' + searchTerm);
  // format weather
  var cityTemp = weather.list[0].main.temp;
  // convert from Kelvin to Fahrenheit
  cityTemp = Math.trunc((cityTemp-273.15)*1.8)+32;
  var cityWind = weather.list[0].wind.speed;
  var cityHumidity = weather.list[0].main.humidity;
  var cityIcon = weather.list[0].weather[0].icon;

  currentWeatherDivEl.innerHTML = `
  <div class="list-item">
    <img src="https://openweathermap.org/img/wn/${cityIcon}.png" />
    <li>Temp: ${cityTemp}</li>
    <li>Wind: ${cityWind}</li>
    <li>Humidity: ${cityHumidity}</li>
  </div>`

  // display forecast
  forecastContainerEl.textContent = '';
  // loop over weather forecast
  for (var i = 1; i < 6; i++) {
    var cityForecastDate = moment().add(i, 'days').format('L');
    // var cityForecastDate = weather.list[0].dt_txt;
    var cityForecastIcon = weather.list[i].weather[0].icon;
    var cityForecastTemp = weather.list[i].main.temp;
    cityForecastTemp = Math.trunc((cityForecastTemp-273.15)*1.8)+32;
    var cityForecastWind = weather.list[i].wind.speed;
    var cityForecastHumidity = weather.list[i].main.humidity;

    // create a container for each repo
    var forecastEl = document.createElement("div");
    forecastEl.classList = "flex-row col-md-2 col-sm-2 forecast-block m-1 p-3";

    // create a li element to hold date
    var forecastDateEl = document.createElement("li");
    forecastDateEl.textContent = cityForecastDate;

    // create a span element to hold weather icon
    var forecastIconEl = document.createElement("img");
    forecastIconEl.setAttribute('src', `https://openweathermap.org/img/wn/${cityForecastIcon}.png`);

    // create a li element to hold temp
    var forecastTempEl = document.createElement("li");
    forecastTempEl.textContent = 'Temp: ' + cityForecastTemp;

    // create a li element to hold wind
    var forecastWindEl = document.createElement("li");
    forecastWindEl.textContent = 'Wind: ' + cityForecastWind;

    // create a li element to hold wind
    var forecastHumidityEl = document.createElement("li");
    forecastHumidityEl.textContent = 'Humidity: ' + cityForecastHumidity;

    // append to container
    forecastEl.appendChild(forecastDateEl);
    forecastEl.appendChild(forecastIconEl);
    forecastEl.appendChild(forecastTempEl);
    forecastEl.appendChild(forecastWindEl);
    forecastEl.appendChild(forecastHumidityEl);

    // append container to the dom
    forecastContainerEl.appendChild(forecastEl);

  }
}

loadCityButtons();

citySearchFormEl.addEventListener("submit", formSubmitHandler);


