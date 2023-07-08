var weatherKey = "db8b1a978a68300e354b8be192722d9d";

var cityName = "San Antonio";
var stateCode = "TX";
var countryCode = "3166-2:UM";

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
    weatherKey;

    fetch(weatherUrl)
    .then(function (response) {

    //   console.log(response);
      return response.json();
    })
    .then(function (data) {
        console.log(data.list);
        console.log(data.list.length);
        console.log(data.list[0].weather);
        console.log(data.list[8].weather);
        console.log(data.list[16].weather);
        console.log(data.list[24].weather);
        console.log(data.list[32].weather);

        // for (var i = 0; i <= 32; i + 8) {

        //     var weatherDay = data.list[i].weather;
        //     console.log(weatherDay);
    
        //   }


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

