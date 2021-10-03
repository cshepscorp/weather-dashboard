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
currentTime.textContent = moment().format('L');

var getSearchedCity = function(city) {
  // format the github api url
  // var apiUrl_old = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=dbafc1b1b5a7f951673e49ae6a6bdea5";
  var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&standard&appid=dbafc1b1b5a7f951673e49ae6a6bdea5";
  fetch(apiUrl).then(function(response) {
  response.json().then(function(data) {
    displayCurrentWeather(data, city);
    uvIndex();
    });
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

    console.log(savedCityButton + 'is saved city');
    savedCities.push(savedCityButton);

    // use JSON.stringify to allow local storage to save values 
    var savedCitiesString = JSON.stringify(savedCities);
    window.localStorage.setItem("saved city buttons", savedCitiesString)
    // console.log(savedCitiesString);

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
  console.log(city + ' is getting called from uvIndex');
  var currentApiUrl = 'http://api.openweathermap.org/data/2.5/weather?q='
    + city + 
    '&appid=dbafc1b1b5a7f951673e49ae6a6bdea5';
  fetch(currentApiUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    // Create a variable to hold the title of the Wikipedia article
    var cityLon = response.coord.lon;
    var cityLat = response.coord.lat;
    console.log(cityLon + ' is');
    console.log(cityLat + ' is');

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='
  + cityLat +
  '&lon='
  + cityLon +
  '&appid=dbafc1b1b5a7f951673e49ae6a6bdea5')
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    // Create a variable to hold the title of the Wikipedia article
    var uvIndexValue = response.current.uvi;
    console.log(uvIndexValue + ' is');

    if (uvIndexValue < 3) {
      uvRating = 'btn-success' 
    } else if (uvIndexValue >= 3 && uvIndexValue < 8) { 
      uvRating = 'btn-warning'
    } else {
      uvRating = 'btn-danger'
    }

    uvIndexEl.innerHTML = `<li style="margin-left: 10px;">UV Index: <button class="${uvRating} uv-btn disabled">${uvIndexValue}</button></li>`;
    // uvIndexEl.appendChild(weatherUvIndexEl);
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
    console.log("after parsing")
    console.log(typeof savedCityButtonItems); // object
    console.log('list of ' + savedCityButtonItems);
  
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
  // console.log('savedCity value' + savedCity);
  // alert("I'm " + savedCity.textContent);
  console.log('savedCities loaded');
  // need to figure out how to define CITY
  // console.log(city + ' is');
  var newCity;  
  newCity = $(this).attr("id");
  getSearchedCity(newCity);

}

function loadSavedCities() {
  // alert("I'm " + savedCity.textContent);
  city = savedCity.textContent;
  console.log('loadsavedcity value: ' + city);
  
  getSearchedCity();

}

var displayCurrentWeather = function(weather, searchTerm){
  // clear old content
  chosenCityData.textContent = "";
  chosenCitySearchTerm.textContent = searchTerm;
  console.log('is chosen city: ' + searchTerm);
  // format weather
  var cityTemp = weather.list[0].main.temp;
  var cityWind = weather.list[0].wind.speed;
  var cityHumidity = weather.list[0].main.humidity;
  var cityIcon = weather.list[0].weather[0].icon;

  // create a container for current weather
  // var currentWeatherDivEl = document.createElement('div');
  // currentWeatherDivEl.classList = 'list-item';

  // // create a span element to hold weather icon
  // var weatherIconEl = document.createElement("img");
  // weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${cityIcon}.png`);

  // // create a span element to hold weather temp
  // var weatherTempEl = document.createElement("li");
  // weatherTempEl.textContent = 'Temp: ' + cityTemp;

  // // create a li element to hold weather wind
  // var weatherWindEl = document.createElement("li");
  // weatherWindEl.textContent = 'Wind: ' + cityWind;

  // // create a li element to hold weather humidity
  // var weatherHumidityEl = document.createElement("li");
  // weatherHumidityEl.textContent = 'Humidity: ' + cityHumidity;

  // // append to container
  // currentTime.appendChild(weatherIconEl);
  // currentWeatherDivEl.appendChild(weatherTempEl);
  // currentWeatherDivEl.appendChild(weatherWindEl);
  // currentWeatherDivEl.appendChild(weatherHumidityEl);

  currentWeatherDivEl.innerHTML = `
  <div class="list-item">
    <img src="http://openweathermap.org/img/wn/${cityIcon}.png" />
    <li>Temp: ${cityTemp}</li>
    <li>Wind: ${cityWind}</li>
    <li>Humidity: ${cityHumidity}</li>
  </div>`
  
  // // append container to the dom/div
  // currentWeatherEl.appendChild(currentWeatherDivEl);

  // display forecast
  forecastContainerEl.textContent = '';
  // loop over weather forecast
  for (var i = 1; i < 6; i++) {
    var cityForecastDate = moment().add([i], 'd').format('L');
    // var cityForecastDate = weather.list[0].dt_txt;
    var cityForecastIcon = weather.list[0].weather[0].icon;
    var cityForecastTemp = weather.list[i].main.temp;
    var cityForecastWind = weather.list[i].wind.speed;
    var cityForecastHumidity = weather.list[i].main.humidity;

    // create a container for each repo
    var forecastEl = document.createElement("div");
    forecastEl.classList = "flex-row col-md-2 col-sm-2 forecast-block m-1 p-1";

    // create a li element to hold date
    var forecastDateEl = document.createElement("li");
    forecastDateEl.textContent = cityForecastDate;

    // create a span element to hold weather icon
    var forecastIconEl = document.createElement("img");
    forecastIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${cityForecastIcon}.png`);

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

getSearchedCity();
loadCityButtons();

citySearchFormEl.addEventListener("submit", formSubmitHandler);


