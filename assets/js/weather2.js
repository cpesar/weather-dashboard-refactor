
var searchHistory = [];



// FORMATS DATE TO MM/DD/YYYY
function getFormattedDate(dt, offset) {
  var date = new Date(dt * 1000 + offset);
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year ;
}

// CONVERTS TEMP FROM KELVIN TO FARENHEIT
function tempConvert(temp) {
  return ((temp - 273.15) * 1.8 + 32).toFixed(2);
}


// GENERATES CURRENT WEATHER DATA AND ADDS IT TO HTML
function addCurrentData(data, location) {
  var todayWeather = document.getElementById('today-weather');
  for (let i = 0; i < 5; i++) {
  todayWeather.innerHTML = `
    <h2>${location}
    ${getFormattedDate(data.current.dt, data.timezone_offset)} 
    <img src="http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png" alt="${data.daily[i].weather.main}"/></h2>
    <h3>Temp: ${tempConvert(data.current.temp)}℉</h3>
    <h3>Humidity: ${data.current.humidity}</h3>
    <h3>Windspeed: ${data.current.wind_speed}MPH</h3>
    <h3>UV Index: ${data.current.uvi}</h3>
  `;
  }
}

// GENERATES 5 DAY FORECAST AND ADDS IT TO HTML
function addFiveDayData(data) {
  let fiveDayForecast = '';
  let fiveDayElement = document.getElementById('five-day-forecast');
//LOOPS THROUGH FIRST FIVE DAYS IN DATA.DAILY ARRAY
 
  for (let i = 0; i < 5; i++) {
    fiveDayForecast += `
      <div class="day-forecast">
        <h3>${getFormattedDate(data.daily[i].dt, data.timezone_offset)}</h3>
        <img src="http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png" alt="${data.daily[i].weather.main}"/>
        <p>Temp: ${tempConvert(data.daily[i].temp.day)}℉</p>
        <p>Humidity: ${data.daily[i].humidity}</p>
      </div>
    `;
      //`` TEMPLATE LITERAL STRINGS USE ${____} AND ALLOW YOU TO WRITE LESS CODE
  }
  fiveDayElement.innerHTML = fiveDayForecast;

}






//REACHES OUT TO APIS AND SETS WEATHER DATA

//initialLocation parameter is a optional param...look up default javascript parameters...only time function gets called without argument passed in is the input search
async function submit(initialLocation = null) {
  var location = document.getElementById('cityState').value;
  //checks if input has value
  if (initialLocation) {
    location = initialLocation;
  }
  var encodedLocation = encodeURIComponent(location);
  var googleApiKey = 'AIzaSyD3inT5sV9fa3A2gXTv4gnOQ8UjoUVEG44';
  var weatherApiKey = '9f7f519c99b1d80f760dfa0c24619d7d';
  var latLong;
  var spinner = document.getElementById('spinner');

  //show spinner on data load
  spinner.classList.remove('hide');

  //if searchHistory array doesn't already include city, state then add to the list
  if (location && !searchHistory.includes(location)) {
    addCityToSearchHistory(location);
  }

  if (location) {
    await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${googleApiKey}`
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        latLong = data.results[0].geometry.location;
        console.log('latlong data: ', latLong);
      });

    await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latLong.lat}&lon=${latLong.lng}&appid=${weatherApiKey}`
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log('weather data: ', data);
        addCurrentData(data, location);
        addFiveDayData(data);
        spinner.classList.add('hide');
      });
  }
}

// GENERATES HTML FOR SEARCH HISTORY LIST
function htmlSearchHistoryGenerator(history) {
  var historyElement = document.getElementById('search-history');
  var historyList = '';
  for (let i = 0; i < history.length; i++) {
    historyList += `<li onclick="submit('${history[i]}')">${history[i]}</li>`;
  }
  historyElement.innerHTML = historyList;
}



//CHECKS LOCAL STORAGE FOR SEARCH HISTORY AND SETS INITAL DATA IF HISTORY EXISITS ON PAGE LOAD
//SETS TO FIRST ITEM IN THE ARRAY(THE LAST SEARCH)
function checkSearchHistory() {
  let history = JSON.parse(localStorage.getItem('weatherSearchHistory'));
  if (history) {
    searchHistory = history;
    htmlSearchHistoryGenerator(searchHistory);
    submit(searchHistory[0]);
  }
}


//ADDS CITY TO SEARCH HISTORY IN LOCAL STORAGE, IF 5 CITIES ARE ALREADY THERE- LAST ITEM IN ARRAY WILL BE REMOVED VIA POP()
//ADDS MOST RECENT SEARCH TO THE FRONT OF THE ARRAY USING UNSHIFT()

function addCityToSearchHistory(city) {
  if (searchHistory.length >= 5) {
    searchHistory.pop();
  }
  searchHistory.unshift(city);
  localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
  htmlSearchHistoryGenerator(searchHistory);
}



//TO DO:
  //CLEAR INPUT BOX AFTER A SEARCH IS COMPLETED
  //GET RID OF BULLET POINTS FROM UL
  //ASK BRAD HOW HE GOT THE 5 DAY WEATHER IMAGES TO APPEAR

  //ADD FAVORABLE MODERATE OR SEVERE IMAGE TO UV INDEX
  //ADD CLICKABLE LINKS TO ALLOW THE USER TO CLICK ON CITIES FROM THE SEARCH