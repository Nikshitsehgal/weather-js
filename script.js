let long;
let lat;
let locationTimezone = document.querySelector(".location-timezone p");
let notification = document.querySelector(".notification");
let tempDescription = document.querySelector(".temperature-description p");
let tempDegree = document.querySelector(".temperature-value p");
const msg = document.querySelector(".main .msg");
let form = document.querySelector(".main form");
let list = document.querySelector("#cities");

// CURRENT LOCATION WEATHER JS
const showError = (error) => {
  notification.style.display = "block";
  notification.innerHTML = `<p>${error.message}</p>`;
};

const setPosition = (position) => {
  long = position.coords.longitude;
  lat = position.coords.latitude;
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${{secret.API_KEY}}`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log("Fetched current weather => ", data);
      const { temp } = data.main;
      const { description } = data.weather[0];
      const { icon } = data.weather[0];
      const { name } = data;
      const { country } = data.sys;

      let temperature = parseFloat((temp - 273.15).toFixed(1));
      tempDegree.textContent = temperature;
      tempDescription.textContent = description;
      locationTimezone.textContent = `${name}, ${country}`;

      // Adding Weather Icon
      let img = document.querySelector(".weather-icon img");
      img.src = `icons/${icon}.png`;
    })
    .catch(() => {
      notification.innerHTML = `<p>Couldn't catch the data.</p>`;
    });
};

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  } else {
    notification.style.display = "block";
    notification.innerHTML = "<p>Browser doesn't support Geolocation.</p>";
  }
});

// To convert the Degree of temperature on click
let button = document.querySelector(".temperature-value");
button.addEventListener("click", () => {
  // console.log("working");
  let temp = document.querySelector(".temperature-value p");
  let degree = document.querySelector("#degree");
  if (degree.textContent == "F") {
    temp.textContent = parseFloat(
      ((temp.textContent - 32) * (5 / 9)).toFixed(1)
    );
    degree.textContent = "C";
  } else {
    temp.textContent = parseFloat(temp.textContent * (9 / 5) + 32).toFixed(1);
    degree.textContent = "F";
  }
});

// CITY SEARCH JS

let submit = document.querySelector("#button");
submit.addEventListener("click", (event) => {
  event.preventDefault();

  let input = document.querySelector("#input").value;
  // console.log(input);

  let listItemsArray = [];

  if (listItemsArray.length > 0) {
    //2
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";
      //athens,gr
      if (input.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of input
        if (input.split(",")[1].length > 2) {
          input = input.split(",")[0];
          content = el
            .querySelector(".location-timezone1 span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".location-timezone1");
          textContent.toLowerCase();
        }
      } else {
        //athens
        content = el
          .querySelector(".location-timezone1 span")
          .textContent.toLowerCase();
      }
      return content == input.toLowerCase();
    });

    //3
    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".location-timezone1 span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      return;
    }
  }

  const proxy = "https://cors-anywhere.herokuapp.com/";
  const api = `${proxy}api.openweathermap.org/data/2.5/weather?q=${input}&appid=${{secret.API_KEY}}`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log("Fetched Data => ", data);
      const { temp } = data.main;
      const { description } = data.weather[0];
      const { icon } = data.weather[0];
      const { name } = data;
      const { country } = data.sys;

      let temperature = parseFloat((temp - 273.15).toFixed(1));

      let cityWeather = `<div class="container">
      <h2 class="location-timezone1" data-name="${name},${country}">
      <span>${name}</span>
      <sup>${country}</sup>
      </h2>
      <div class="weather-container1">
      <div class="weather-icon1">
      <img src="icons/${icon}.png" alt="" />
      </div>
      <div class="temperature-value1">
      <p>${temperature}</p>
      <span> °</span><span id="degree1">C</span>
      </div>
      <div class="temperature-description1">
      <p>${description}</p>
      </div>
      </div></div>`;

      let ul = document.querySelector("#cities");
      let li = document.createElement("li");
      li.innerHTML = cityWeather;
      li.classList.add("city");
      ul.appendChild(li);
      let listItems = list.querySelectorAll(".ajax-section .city");
      listItemsArray = Array.from(listItems);

      //Changing Degree
      listItemsArray.forEach((listItem) => {
        // console.log("List Item => ", listItem);
        let button1 = listItem.querySelector(".temperature-value1");
        button1.addEventListener("click", () => {
          // Degree Convertor for Searched Weather
          // console.log("working");
          let temp = listItem.querySelector(".temperature-value1 p");
          let degree = listItem.querySelector("#degree1");
          if (degree.textContent == "F") {
            temp.textContent = parseFloat(
              ((temp.textContent - 32) * (5 / 9)).toFixed(1)
            );
            degree.textContent = "C";
          } else {
            temp.textContent = parseFloat(
              temp.textContent * (9 / 5) + 32
            ).toFixed(1);
            degree.textContent = "F";
          }
        });
      });
    })
    .catch((error) => {
      msg.innerHTML = `<p>Please search for a valid city 😩</p>`;
    });
  msg.textContent = "";
  form.reset();
});

// Clear Event
let clear = document.querySelector(".clear");
clear.addEventListener("click", (event) => {
  event.preventDefault();
  // console.log("clear");
  let ul = document.querySelector("#cities");
  if (ul) {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
  }
});

// Now, make the watchlist button work.
