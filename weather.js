let cityArr = [];

let apiKey = "c5ae11decc6e8fac2bb42d07856112b1";

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function fetchCoordinates() {
    try {
        const coords = await getCurrentPosition();
        return {
            latitude: coords.coords.latitude,
            longitude: coords.coords.longitude,
        };
    } catch (err) {
        printError("You didn't added permision to access to your current location");
        console.log(err);
    }
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ":" + min + ":" + sec;
    return time;
}

async function setCurrentLocation(weather) {

    let body = document.querySelector("body");
    let p = document.createElement("p");
    body.append(p);

    p.innerText = `
                Current weather:
                Temperature: ${(weather.main.temp - 272.15).toFixed(0)}°C
                Sunrise:${timeConverter(weather.sys.sunrise)}
                Sunset:${timeConverter(weather.sys.sunset)}
                Latitude: ${weather.coord.lon} °
                Longitude: ${weather.coord.lat} °
                Searched Weather:No Searches`;
}

async function getCurrentWeatherByLatLon(longitude, latitude) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        printError("current weather by latitude and longitude failed");
        console.log("get current weather by latitude and longitude failed" + err);
    }
}
async function getInput(event) {
    try {
        event.preventDefault();

        let input = document.querySelector("input");
        let cityName = "";

        if (input.value !== "") {
            cityName = input.value;

            if (isCityExists(cityName, cityArr, input))
                await getCurrentWeatherByCity(cityName);

            input.value = "";
        } else {
            printError("Empty Search!");
        }
    } catch (err) {
        printError("input failed");
        console.log("Something failed in get input" + err);
    }
}
function isCityExists(cityName, cityArr, input) {
    try {
        if (cityArr.length === 0) {
            cityArr.push(input.value);
            return true;
        }
        if (cityArr.find((el) => el === cityName)) {
            document.querySelector(".errorMsg").innerText =
                "You already searched for this city!";
            return false;
        } else {
            cityArr.push(input.value);
            return true;
        }
    } catch (err) {
        printError("check city exits failed");
        console.log("something wrong with isCityExists" + err);
    }
}

function printError(errorTxt) {
    document.querySelector(".errorMsg").innerText = errorTxt;
}

async function getCurrentWeatherByCity(cityName) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
        ); //${cityName}Kfar Saba
        const data = await res.json();
        let p = document.querySelector("p");
        p.innerText = p.innerText.replace("No Searches", "");
        p.innerText += `
                      ${data.name} : ${(data.main.temp - 272.15).toFixed(
            0
        )}°C`;

        return data;
    } catch (err) {
        printError("fetch current weather by city failed");
        console.log(err);
    }
}

async function initWeather() {

    try {
        const position = await fetchCoordinates();
        const weather = await getCurrentWeatherByLatLon(
            position.latitude,
            position.longitude
        );
        const show = await setCurrentLocation(weather);
        let button = document.querySelector("button");
        button.addEventListener("click", getInput);
    }
    catch (err) {
        console.log("Initialization Error");
    }
}
initWeather();
