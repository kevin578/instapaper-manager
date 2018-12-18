var request = require('request');
var cheerio = require('cheerio');



const scrapingSchedule = {
    ThursdayPM: ["leaders"],
    Friday: ["letters", "briefing"],
    Saturday: ["united-states", "the-americas"],
    Sunday: ["asia", "china"],
    Monday: ["middle-east-and-africa", "europe"],
    Tuesday: ["britain", "international", "business"],
    Wednesday: ["finance-and-economics", "science-and-technology"],
    Thursday: ["books-and-arts", "economic-and-financial-indicators", "graphic-detail"]
}

const currentDay = "Tuesday";
const baseURL = "https://www.economist.com/printedition/2018-12-15";
let URLsToSend = []



request('https://www.economist.com/printedition/2018-12-15', function(err, resp, html) {
        if (!err){
          let $ = cheerio.load(html);
            
            $('.list__link').each(function(i, el) {
                const urlEnd = $(this).attr('href');
                const section = urlEnd.split('/')[1];
                if (scrapingSchedule[currentDay].includes(section)) {
                    URLsToSend.push(baseURL + urlEnd);
                }
            })

            

        };
        

});

