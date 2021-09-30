var searchedCity = document.querySelector("#city-form"); // search area's form id
var searchedCityButton = document.querySelector("#citysearch"); // input area's  id

var getSearchedCity = function() {
    fetch("http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=dbafc1b1b5a7f951673e49ae6a6bdea5");

    console.log("function was called");
  };
  

  getSearchedCity();