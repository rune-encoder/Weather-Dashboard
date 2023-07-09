var weatherKey = "db8b1a978a68300e354b8be192722d9d";

var currentDate = new Date().toLocaleString("default", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  hour: '2-digit',
  minute:'2-digit'
});

// var units = metric/imperial

// Create Variables for Element ID representing our Weather Display.
var weatherBoard = document.getElementById("weather-board");
var weatherContainer = document.getElementById("weather-container");
var fiveDayContainer = document.getElementById("forecast-container");

// Create Variables for our Input Form, Search Button, Clear Button, and History Buttons.
var inputEl = document.getElementById("cityname");
var searchBtn = document.getElementById("searchBtn");
var clearBtn = document.getElementById("clearBtn");
var historyBtn = document.getElementsByClassName("historyBtn");
var dateEl = document.getElementById("currentDate");

// Create Variable for our City History Container
var historyEl = document.getElementById("history");

// Create Empty Array for our Save Data.
var saveHistoryData = [];

// Create Variable representing data saved in local storage (if any).
var storedHistoryData = JSON.parse(localStorage.getItem("saveHistoryData"));

// Function creates buttongs for cities user previously chose.
function renderCityHistory() {
  // Goes through our saved previous city data.
  for (var i = 0; i < saveHistoryData.length; i++) {
    // Creates button for the previous city.
    var historyBtn = document.createElement("button");
    // Sets class so it is easy to target later.
    historyBtn.setAttribute("class", "historyBtn");
    // Sets Data Attribute for Lat to extract later.
    historyBtn.dataset.lat = saveHistoryData[i].lat;
    // Sets Data Attribute for Lon to extract later.
    historyBtn.dataset.lon = saveHistoryData[i].lon;
    // Sets Data Attribute for the name of the City to extract later.
    historyBtn.dataset.city = saveHistoryData[i].city;
    // Sets city name in the button text.
    historyBtn.textContent = saveHistoryData[i].city;
    // Appends the button to the history container.
    historyEl.appendChild(historyBtn);
  }
  return;
}

// Function ran after getting the current weather to save in local storage.
function saveHistory(lat, lon, cityName) {
  // Creates object to store city name, lat and lon data.
  var cityData = {
    city: cityName,
    lat: lat,
    lon: lon,
  };

  // *IMPORTANT* *PREVENTS DUPLICATE IN HISTORY AND LOCAL STORAGE*
  // This will prevent duplicate data in both LocalStorage and in displayed history.
  // If there is currently saved history data...
  if (saveHistoryData !== undefined) {
    // Scan through our saved data.
    for (i = 0; i < saveHistoryData.length; i++) {
      // If saved data HAS A DUPLICATE OF THE CHOSEN CITY label duplicateCity to true.
      if (saveHistoryData[i].city.includes(cityData.city) === true) {
        var duplicateCity = true;
        // Break out of for loop once confirmed true.
        break;
        // If saved data DOES NOT HAVE A DUPLCIATE OF THE CHOSEN CITY label duplicateCity to false.
      } else {
        var duplicateCity = false;
      }
    }
  }

  // If the chosen city is NOT DUPLICATED push and store new data in local storage and render history buttons.
  if (duplicateCity === false || duplicateCity === undefined) {
    saveHistoryData.push(cityData);
    localStorage.setItem("saveHistoryData", JSON.stringify(saveHistoryData));
    renderCityHistory();
    // If the chosen city IS DUPLICATED do NOT store new data in local storage and clear and render history buttons.
  } else {
    historyEl.innerHTML = null;
    renderCityHistory();
  }
}

//Function Passes our selected City Lat and Lon Coordinates.
//Or Passes our selected City from our History to pass Lat and Lon Coordinates.
function getWeather(lat, lon) {
  // API URL to get current weather
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    weatherKey +
    "&units=imperial";

  // Obtains data from the Current Weather API
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Obtain our Chosen City's Name from API
      var cityName = data.name;
      // Obtain and Format current weather date.
      var currentWeatherDate =
        "(" +
        new Date().toLocaleString("default", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }) +
        ")";
      // Obtain Weather Description.
      var weatherDesc = data.weather[0].description;
      // Obtain Weather Status Icon.
      var weatherIcon =
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
      // Obtain Weather Temperature.
      var weatherTemp = "Temp: " + data.main.temp + " °F";
      // Obtain Weather Wind Speed.
      var weatherWind = "Wind: " + data.wind.speed + " MPH";
      // Obtain Weather Humidity.
      var weatherHumidity = "Humidity: " + data.main.humidity + " %";

      // Append collected data to the page. Display Current Weather.
      weatherContainer.innerHTML =
        "<h5>" +
        cityName +
        " " +
        currentWeatherDate +
        " " +
        '<img class="imgsize"src="' +
        weatherIcon +
        '">' +
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

      // Runs function to save data to local storage passing Lat, Lon and City Name.
      saveHistory(lat, lon, cityName);
    });

  // API URL to get 5-Day Forecast
  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    weatherKey +
    "&units=imperial";

  // Obtains data from the 5-Day Forecast API
  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Adds our header for the 5-Day Forecast
      weatherBoard.textContent = "5-Day Forecast: ";

      // Goes through and creates 5 cards for our Forecast.
      for (var i = 0; i <= 32; i += 8) {
        // Forecast Raw Date (Needs to be Formatted).
        var forecastDateRaw = data.list[i].dt_txt;
        // Formatted Forecast Date.
        var forecastDate = new Date(forecastDateRaw).toLocaleString("default", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
        // Obtain Forecast Description.
        var forecastDesc = data.list[i].weather[0].description;
        // Obtain Forecast Status Icon.
        var forecastIcon =
          "https://openweathermap.org/img/wn/" +
          data.list[i].weather[0].icon +
          ".png";
        // Obtain Forecast Temperature.
        var forecastTemp = "Temp: " + data.list[i].main.temp + " °F";
        // Obtain Forecast Wind Speed.
        var forecastWind = "Wind: " + data.list[i].wind.speed + " MPH";
        // Obtain Forecast Humidity.
        var forecastHumidity = "Humidity: " + data.list[i].main.humidity + " %";

        // Create Container that will hold our 5-Day Forecast.
        var fiveDayEl = document.createElement("div");
        // Sets Class for the 5-Day Forecast Container.
        fiveDayEl.setAttribute("class", "five-day rounded");

        // Appends Forecast Data to the webpage.
        fiveDayContainer.appendChild(fiveDayEl);
        fiveDayEl.innerHTML =
          "<h5>" +
          forecastDate +
          "</h5>" +
          '<img src="' +
          forecastIcon +
          '">' +
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

// Function passes user input (city name) and obtains Lat and Lon.
function getGeoCode(cityName) {
  // API Url to get Lat and Lon coordinates.
  var geoCodeUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=" +
    weatherKey;

  // Obtains data from the API
  fetch(geoCodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Obtain City's Lat and Lon Coordinates
      var lat = data[0].lat;
      var lon = data[0].lon;
      // Run our Lat and Lon coordinates through a function to get the weather.
      getWeather(lat, lon);
    });
}

// Function run after we hit the search button
function userInput() {
  // Collects user input city name
  var cityName = inputEl.value.trim();
  // Clears the value after getting user input
  inputEl.value = null;
  // Runs our user input (city name) through our Geo Code function to get lat and lon.
  getGeoCode(cityName);
}

// Initialize: First function to start.
function init() {
    dateEl.textContent = currentDate;
  // If data is present in local storage update our saved data.
  if (storedHistoryData !== null) {
    saveHistoryData = storedHistoryData;
    // If data is present in local storage render previous Cities History.
    renderCityHistory();
  }

  // Click on a button of a city you previously searched.
  historyEl.addEventListener("click", function (event) {
    // Clicked target has to be a button. If it is the container it will cancel function.
    if (!event.target.matches(".historyBtn")) return;
    // Clears rendered Buttons on our history list.
    historyEl.innerHTML = null;
    // Clears container for 5-Day Forecast.
    fiveDayContainer.innerHTML = null;
    // Collects data attribute from selected button and sets the Lat and Lon.
    var historyLat = event.target.dataset.lat;
    var historyLon = event.target.dataset.lon;
    // Runs our function to render the weather passing the Lat and Lon from our button.
    getWeather(historyLat, historyLon);
  });

  // Click on the search button.
  searchBtn.addEventListener("click", function () {
    // If city history section has any buttons they are cleared.
    if (historyEl.children.length > 0) {
      historyEl.innerHTML = null;
    }
    // If 5-Day forecast has 1 or more cards clear section.
    // Prevents glitch of having new cards stack underneath them.
    if (fiveDayContainer.children.length > 0) {
      fiveDayContainer.innerHTML = null;
    }
    // Runs our function to get the user's input.
    userInput();
  });

  // Click on the clear button.
  clearBtn.addEventListener("click", function () {
    // Local storage is cleared.
    localStorage.clear();
    // Input value on form (if any) is cleared.
    inputEl.value = null;
    // Previously selected cities history is cleared.
    historyEl.innerHTML = null;
    // 5-Day Forecast Header is cleared.
    weatherBoard.innerHTML = null;
    // Current Weather is cleared.
    weatherContainer.innerHTML = null;
    // 5-Day Forecast is cleared.
    fiveDayContainer.innerHTML = null;
    // Saved History (not local storage) is cleared.
    // Prevents glitch.
    saveHistoryData = [];
  });
}

// Initialize: Starts our init Function.
init();
