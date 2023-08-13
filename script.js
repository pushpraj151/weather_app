let weather = {
    apiKey: "aba6ff9d6de967d5eac6fd79114693cc",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
  
      // Fetch the five-day forecast after displaying the current weather
      this.fetchForecast(name);
    },
    fetchForecast: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("No forecast found.");
          }
          return response.json();
        })
        .then((data) => this.displayForecast(data));
    },
    displayForecast: function (data) {
      const forecastElement = document.querySelector(".forecast");
      forecastElement.innerHTML = "";
  
      const forecastData = data.list;
      for (let i = 0; i < forecastData.length; i += 8) {
        const forecastDate = new Date(forecastData[i].dt * 1000).toLocaleDateString('en', { weekday: 'long' });
        const forecastTemp = forecastData[i].main.temp.toFixed(1) + "°C";
        const forecastIcon = "https://openweathermap.org/img/wn/" + forecastData[i].weather[0].icon + ".png";
  
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
          <div class="date">${forecastDate}</div>
          <div class="icon"><img src="${forecastIcon}" alt="Weather Icon"></div>
          <div class="temp">${forecastTemp}</div>
        `;
  
        forecastElement.appendChild(forecastItem);
      }
  
      forecastElement.classList.remove("loading");
    },
  };
  
  let geocode = {
    reverseGeocode: function (latitude, longitude) {
      var apikey = "90a096f90b3e4715b6f2e536d934c5af";
      var api_url = "https://api.opencagedata.com/geocode/v1/json";
      var request_url =
        api_url +
        "?" +
        "key=" +
        apikey +
        "&q=" +
        encodeURIComponent(latitude + "," + longitude) +
        "&pretty=1" +
        "&no_annotations=1";
  
      var request = new XMLHttpRequest();
      request.open("GET", request_url, true);
  
      request.onload = function () {
        if (request.status == 200) {
          var data = JSON.parse(request.responseText);
          weather.fetchWeather(data.results[0].components.city);
          console.log(data.results[0].components.city);
        } else if (request.status <= 500) {
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log("error msg: " + data.status.message);
        } else {
          console.log("server error");
        }
      };
  
      request.onerror = function () {
        console.log("unable to connect to server");
      };
  
      request.send();
    },
    getLocation: function () {
      function success(data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
      } else {
        weather.fetchWeather("Bhopal");
      }
    },
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    const city = document.querySelector(".search-bar").value;
    weather.fetchWeather(city);
    forecast.fetchForecast(city);
  });
  weather.fetchWeather("Bhopal");
  
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      const city = document.querySelector(".search-bar").value;
      weather.fetchWeather(city);
      forecast.fetchForecast(city);
    }
  });
  
  // Fetch the current weather and forecast for Bhopal on page load
  geocode.getLocation();
  