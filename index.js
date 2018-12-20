const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");
const queryString = require("query-string");
const express = require("express");

require('dotenv').config()
const app = express();

app.post("/sendArticles", (req, res) => {
  getStories(req.query.day).then(()=> {
    res.send("Articles sent");
  })
});

const scrapingSchedule = {
  ThursdayPM: ["leaders"],
  Friday: ["letters", "briefing"],
  Saturday: ["united-states", "the-americas"],
  Sunday: ["asia", "china"],
  Monday: ["middle-east-and-africa", "europe"],
  Tuesday: ["britain", "international", "business"],
  Wednesday: ["finance-and-economics", "science-and-technology"],
  Thursday: [
    "books-and-arts",
    "economic-and-financial-indicators",
    "graphic-detail"
  ]
};

const baseURL = "https://www.economist.com";
let links = [];

function getStories(currentDay) {
  return new Promise(function(resolve, reject) {
    request("https://www.economist.com/printedition/current", function(
      err,
      resp,
      html
    ) {
      if (!err) {
        let $ = cheerio.load(html);

        $(".list__link").each(function(i, el) {
          const urlEnd = $(this).attr("href");
          const section = urlEnd.split("/")[1];
          if (scrapingSchedule[currentDay].includes(section)) {
            links.push(baseURL + urlEnd);
          }
        });

        links = links.reverse();

        addContent();

        function addContent() {
          axios
            .post(
              `https://www.instapaper.com/api/add?username=${process.env.USERNAME}&url=${
                links[0]
              }`
            )
            .then(() => {
              if (links.length > 1) {
                links.shift();
                addContent();
              }
              else {
                resolve();
              }
            });
        }
      }
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
