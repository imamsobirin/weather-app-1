let long, lat, city;

const input = document.getElementById("search"),
  searchButton = document.querySelector(".btn"),
  lokasi = document.querySelector(".location"),
  time = document.querySelector(".time"),
  temperatureValue = document.querySelector(".temperature-value"),
  temperatureUnit = document.querySelector(".temperature-unit"),
  deskripsi = document.querySelector(".description"),
  feelsLike = document.querySelector(".feels-like"),
  kelembaban = document.querySelector(".humidity"),
  windSpeed = document.querySelector(".wind-speed"),
  errorMessage = document.querySelector(".error-message"),
  history = document.querySelector(".forecast-week"),
  ikon = document.querySelector(".icon");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    long = position.coords.longitude;
    lat = position.coords.latitude;

    const key = "f19f193c6183109792cea405b58345ee";
    var unit = "metric";
    //lokasi pengguna
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=${unit}`;

    //histori cuaca
    let api3 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${key}&units=${unit}`;

    //data berdasarkan pencarian kota
    searchButton.addEventListener("click", function () {
      city = input.value;
      const api2 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
      getApi(api2, isiTampilanHeader, "data");
    });

    //enter untuk pencarian
    input.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        searchButton.click();
      }
    });

    // data berdasar lokasi pengguna
    getApi(api, isiTampilanHeader, "data");
    getApi(api3, isiTampilanHistori, "data");
  });
} else {
  errorMessage.style.display = "block";
  document.querySelector(".current-weather").style.display = none;
  document.querySelector(".history-weather").style.display = none;
}

function getApi(url, displayData, data) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //lokasi, waktu, icon, temperatur, feels like, humidity, windspeed, deskripsi
      displayData(data);
    });
}
function isiTampilanHeader(data) {
  const { feels_like, humidity, temp } = data.main;
  const { description, icon, main } = data.weather[0];
  const wind = data.wind.speed;
  temperatureValue.innerHTML = temp;
  deskripsi.innerHTML = `${main} | ${description}`;
  feelsLike.innerHTML = `Feels like ${feels_like}`;
  kelembaban.innerHTML = `Humidity : ${humidity}%`;
  windSpeed.innerHTML = `Wind : ${wind} m/s`;
  lokasi.innerHTML = data.name;
  console.log(icon);
  ikon.src = `http://openweathermap.org/img/w/${icon}.png`;
  console.log(ikon.src);
}

const isiTampilanHistori = (data) => {
  //tanggal, icon, temperature, keterangan
  data = data.daily;
  for (let i = 1; i < data.length; i++) {
    let date = new Date(data[i].dt * 1000).toDateString();
    date = date.replace(/\s/, ",<br>");
    const icon = data[i].weather[0].icon;
    const temp = data[i].temp.eve;
    const main = data[i].weather[0].main;
    history.innerHTML += `
      <div class="day">
        <p class="day-name">${date}</p>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="" class="day-icon" />
        <p>${main}</p>
        <p class="day-temperature">${temp}&#176;C</p>
      </div>
    `;
  }
};
