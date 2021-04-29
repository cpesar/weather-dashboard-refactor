
var searchHistory = [];



// FORMATS DATE TO MM/DD/YYYY
function getFormattedDate(dt, offset) {
  var date = new Date(dt * 1000 + offset);
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year;
}

// CONVERTS TEMP FROM KELVIN TO FARENHEIT
function tempConvert(temp) {
  return ((temp - 273.15) * 1.8 + 32).toFixed(2);
}



// GENERATES CURRENT WEATHER DATA AND ADDS IT TO HTML
function addCurrentData(data, location) {
  var todayWeather = document.getElementById('today-weather');
  todayWeather.innerHTML = `
    <h2>${location}</h2>
    <h3>Date: ${getFormattedDate(data.current.dt, data.timezone_offset)} </h3>
    <h3>Temp: ${tempConvert(data.current.temp)}℉</h3>
    <h3>Humidity: ${data.current.humidity}</h3>
    <h3>Windspeed: ${data.current.wind_speed}m/s</h3>
    <h3>UV Index: ${data.current.uvi}</h3>
  `;
}

// GENERATES 5 DAY FORECAST AND ADDS IT TO HTML
function addFiveDayData(data) {
  let fiveDayForecast = '';
  let fiveDayElement = document.getElementById('five-day-forecast');
  //loops through first 5 days in data.daily array returned from api
  //`` template strings allow you to write multi lines like below... ${...in here you can add javascript stuff}
  for (let i = 0; i < 5; i++) {
    fiveDayForecast += `
      <div class="day-forecast">
        <h3>${getFormattedDate(data.daily[i].dt, data.timezone_offset)}</h3>
        <img src="http://openweathermap.org/img/w/${
          data.daily[i].weather[0].icon
        }.png" alt="${data.daily[i].weather.main}"/>
        <p>Temp: ${tempConvert(data.daily[i].temp.day)}℉</p>
        <p>Humidity: ${data.daily[i].humidity}</p>
      </div>
    `;
  }
  fiveDayElement.innerHTML = fiveDayForecast;
}