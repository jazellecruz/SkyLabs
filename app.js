// jshint esversion6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
require('dotenv').config();


app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

const weatherInfo = [];

app.get("/", (req, res) => {
    res.render("home" , {result : weatherInfo});
});

app.get("/results", (req, res) => {

    const date = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    const currentDate = date.toLocaleDateString("en-US", options);

    res.render("result", {result : weatherInfo, day : currentDate});
    console.log(weatherInfo);

});

app.post("/" , (req, res) => {

    const city = req.body.cityInput;

    const url =process.env.API_URL + 'q=' + city + '&appid=' + process.env.API_KEY +"&units=metric";
    
    https.get(url, (response) => {
        
        response.on("data", (data) => {

            const weatherData = JSON.parse(data);
            

            const results = {
                lon: weatherData.coord.lon,
                lat: weatherData.coord.lat,
                weather:weatherData.weather[0].description,
                weatherIcon:  "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png",
                temp: weatherData.main.temp,
                feelsLike:  weatherData.main.feels_like,
                minTemp: weatherData.main.temp_min,
                maxTemp: weatherData.main.temp_max,
                humidity: weatherData.main.humidity,
                visibility: weatherData.visibility,
                windSpeed: weatherData.wind.speed,
                windDeg: weatherData.wind.deg,
                country: weatherData.sys.country,
                city: weatherData.name
            }

            weatherInfo.push(results);
            res.redirect("/results");
            
         });

    });

    

});

app.listen("3000", () => {
    console.log("SERVER IS RUNNING ON PORT 3000.");
});

