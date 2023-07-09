var weatherKey = "db8b1a978a68300e354b8be192722d9d";

var currentDate = new Date();
// var units = metric/imperial

var weatherContainer = document.getElementById("weather-container");
var fiveDayContainer = document.getElementById("forecast-container");
var inputEl = document.getElementById("cityname");
var searchBtn = document.getElementById("searchBtn");

function getWeather(lat, lon) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    weatherKey +
    "&units=imperial";

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityName = data.name;
      var currentWeatherDate =
        "(" +
        new Date().toLocaleString("default", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }) +
        ")";
      var weatherDesc = data.weather[0].description;
      //   var weatherIcon = data.weather[0].icon;
      var weatherTemp = "Temp: " + data.main.temp + " °F";
      var weatherWind = "Wind: " + data.wind.speed + " MPH";
      var weatherHumidity = "Humidity: " + data.main.humidity + " %";

      weatherContainer.innerHTML =
        "<h5>" +
        cityName +
        " " +
        currentWeatherDate +
        "</h5>" +
        "<p>" +
        weatherDesc +
        "<br>" +
        weatherTemp +
        "<br>" +
        weatherWind +
        "<br>" +
        weatherHumidity +
        "</p>";
    });

  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    weatherKey +
    "&units=imperial";

  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i <= 32; i += 8) {
        var forecastDateRaw = data.list[i].dt_txt;
        var forecastDate = new Date(forecastDateRaw).toLocaleString("default", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });

        var forecastDesc = data.list[i].weather[0].description;
        // var forecastIcon = data.list[i].weather[0].icon;
        var forecastTemp = "Temp: " + data.list[i].main.temp + " °F";
        var forecastWind = "Wind: " + data.list[i].wind.speed + " MPH";
        var forecastHumidity = "Humidity: " + data.list[i].main.humidity + " %";

        var fiveDayEl = document.createElement("div");
        fiveDayEl.setAttribute(
          "class",
          "five-day border border-primary border-1"
        );

        fiveDayContainer.appendChild(fiveDayEl);
        fiveDayEl.innerHTML =
          "<h5>" +
          forecastDate +
          "</h5>" +
          "<p>" +
          forecastDesc +
          "<br>" +
          forecastTemp +
          "<br>" +
          forecastWind +
          "<br>" +
          forecastHumidity +
          "</p>";
      }
    });
}

function getGeoCode(cityName) {
  var geoCodeUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=" +
    weatherKey;

  fetch(geoCodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeather(lat, lon);
    });
}

function userInput() {
  var cityName = inputEl.value.trim();
  inputEl.value = " ";
  getGeoCode(cityName);
}

function init() {
  searchBtn.addEventListener("click", function () {
    if (fiveDayContainer.children.length > 0) {
      fiveDayContainer.innerHTML = null;
    }
    userInput();
  });
}

init();
