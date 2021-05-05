// CURRENT LOCATION WEATHER JS

let long;
let lat;
let locationTimezone = document.querySelector(".location-timezone p");
let notification = document.querySelector(".notification");
let tempDescription = document.querySelector(".temperature-description p");
let tempDegree = document.querySelector(".temperature-value p");
const msg = document.querySelector(".main .msg");
let form = document.querySelector(".main form");
let list = document.querySelector(".cities");
let cityArr = [];

showError = (error) => {
  notification.style.display = "block";
  notification.innerHTML = `<p>${error.message}</p>`;
};

setPosition = (position) => {
  long = position.coords.longitude;
  lat = position.coords.latitude;
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=d91f6bd2891f2a775352b5ce4e0f393c`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
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
    temp.textContent = temp.textContent * (9 / 5) + 32;
    degree.textContent = "F";
  }
});

// CITY SEARCH JS

let submit = document.querySelector("#button");
submit.addEventListener("click", (event) => {
  event.preventDefault();

  let input = document.querySelector("#input").value;
  // console.log(input);

  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

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
      // input.focus();
      return;
    }
  }

  const proxy = "https://cors-anywhere.herokuapp.com/";
  const api = `${proxy}api.openweathermap.org/data/2.5/weather?q=${input}&appid=773b3f0c966fd9784776c75e441767b7`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
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
      <div class="temperature-value">
      <p>${temperature}</p>
      <span> °</span><span id="degree">C</span>
      </div>
      <div class="temperature-description1">
      <p>${description}</p>
      <img src="icons/add.png" />
      </div>
      </div></div>`;

      let li = document.createElement("li");
      li.innerHTML = cityWeather;
      li.classList.add("city");
      li.classList.add("uncheck");

      cityArr.push(li);
      display();
    })
    .catch((error) => {
      msg.innerHTML = `<p>Please search for a valid city 😩</p>`;
    });
  msg.textContent = "";
  form.reset();
  // input.focus();
});

// Data Display

// NOT ABLE to display weather searched with removing weather
const display = (cityArr) => {
  let ul = document.querySelector("#cities");
  if (ul.childNodes.length > 0) {
    for (let i = 1; i < ul.childNodes.length; i++) {
      ul.remove(ul.lastChild);
    }
  }
  if (cityArr.length > 0) {
    for (let i = 0; i < cityArr.length; i++) {
      ul.appendChild(cityArr[i]);
    }
  }
};

//
const listItems = list.querySelectorAll(".ajax-section .city");
const listItemsArray = Array.from(listItems);
console.log(listItemsArray);

// WatchList Checker Event
listItemsArray.forEach((listItem) => {
  let watchlist = listItem.querySelector(".watchlist");
  watchlist.addEventListener("click", () => {
    console.log("working");
    if (watchlist.classList == "watchlist add") {
      watchlist.src = "icons/checked.png";
      watchlist.classList.remove("add");
      watchlist.classList.add("checked");
      listItem.classList.remove("uncheck");
      listItem.classList.add("check");
    } else {
      watchlist.src = "icons/add.png";
      watchlist.classList.remove("checked");
      watchlist.classList.add("add");
      listItem.classList.remove("check");
      listItem.classList.add("uncheck");
    }
  });

  // Clear Event
  let clear = document.querySelector(".clear");
  clear.addEventListener("click", (event) => {
    event.preventDefault();
    if (cityArr.length > 0) {
      cityArr = cityArr.filter((el) => {
        if (el.className == "city uncheck") {
          console.log(el);
          return el;
        }
      });
    }
  });

  // Degree Convertor for Searched Weather
  let button = listItem.querySelector(".temperature-value");
  button.addEventListener("click", () => {
    // console.log("working");
    let temp = listItem.querySelector(".temperature-value p");
    let degree = listItem.querySelector("#degree");
    if (degree.textContent == "F") {
      temp.textContent = parseFloat(
        ((temp.textContent - 32) * (5 / 9)).toFixed(1)
      );
      degree.textContent = "C";
    } else {
      temp.textContent = temp.textContent * (9 / 5) + 32;
      degree.textContent = "F";
    }
  });
});

// Now, make the watchlist button work.
