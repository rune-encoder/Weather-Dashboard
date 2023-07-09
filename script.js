var weatherKey = "db8b1a978a68300e354b8be192722d9d";

var cityName = "San Antonio";
var stateCode = "TX";
var countryCode = "3166-2:UM";

var currentDate = new Date();
// var units = metric/imperial

var fiveDayContainer = document.getElementById("forecast-container");

var geoCodeUrl =
  "http://api.openweathermap.org/geo/1.0/direct?q=" +
  cityName +
  "," +
  stateCode +
  "," +
  countryCode +
  "&limit=5&appid=" +
  weatherKey;

function getWeather(lat, lon) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    weatherKey +
    "&units=imperial";

  fetch(weatherUrl)
    .then(function (response) {
      //   console.log(response);
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i <= 32; i += 8) {
        var weatherDateRaw = data.list[i].dt_txt;
        var weatherDate = new Date(weatherDateRaw).toLocaleString("default", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });

        var weatherDesc = data.list[i].weather[0].description;
        // var weatherIcon = data.list[i].weather[0].icon;
        var temp = "Temp: " + data.list[i].main.temp + " °F";
        var wind = "Wind: " + data.list[i].wind.speed + " MPH";
        var humidity = "Humidity: " + data.list[i].main.humidity + " %";

        var fiveDayEl = document.createElement("div");
        fiveDayEl.setAttribute(
          "class",
          "five-day border border-primary border-1"
        );

        fiveDayContainer.appendChild(fiveDayEl);
        fiveDayEl.innerHTML =
          "<h5>" +
          weatherDate +
          "</h5>" +
          "<p>" +
          weatherDesc +
          "<br>" +
          temp +
          "<br>" +
          wind +
          "<br>" +
          humidity +
          "</p>";
      }
    });
}

function getGeoCode() {
  fetch(geoCodeUrl)
    .then(function (response) {
      //   console.log(response);

      return response.json();
    })
    .then(function (data) {
      //   console.log(data);

      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeather(lat, lon);
    });
}

getGeoCode();
