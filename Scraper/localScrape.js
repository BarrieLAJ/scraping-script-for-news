const puppetter = require("puppeteer");
const path = require("path");
const fs = require("fs");
const LocalNews = require("../models/localNews");

let previousNews;

//localnews scraping
const localScrape = async () => {
  try {
    const browser =  puppetter.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    // const url = 'https://www.thesierraleonetelegraph.com/'
    await page.goto("https://www.thesierraleonetelegraph.com/", {
      timeout: 0,
      waitUntil: "networkidle2",
    });

    const localNews = await page.evaluate(() => {
      //initializing varialbe to store the news that will be returned
      const news = [];
      //dom query for the sections of the page
      document
        .querySelectorAll(".mh-content .mh_magazine_posts_grid .mh-posts-grid")
        .forEach((el) => {
          //dom query for the articles in the each section
          el.querySelectorAll(".mh-posts-grid-col").forEach((elem) => {
            //setting values from the dom to the varialbes
            let title = elem
              .querySelector("article.mh-posts-grid-item h3.entry-title a")
              .textContent.trim();
            let link = elem
              .querySelector("article.mh-posts-grid-item h3.entry-title a")
              .getAttribute("href");
            let img = elem
              .querySelector(
                "article.mh-posts-grid-item figure.mh-posts-grid-thumb a.mh-thumb-icon img"
              )
              .getAttribute("src");
            let category = elem
              .querySelector(
                "article.mh-posts-grid-item figure.mh-posts-grid-thumb div.mh-image-caption"
              )
              .textContent.trim();
            let body = elem
              .querySelector(
                "article.mh-posts-grid-item div.mh-posts-grid-excerpt div.mh-excerpt p"
              )
              .textContent.trim();
            let date = elem.querySelector(
              "article.mh-posts-grid-item div.entry-meta span.entry-meta-date a"
            ).textContent;
            //adding each article to the news array
            news.push({ title, link, img, category, body, date });
          });
        });
      //return all the news from the page
      return news;
    });

    if (fs.existsSync(path.join(__dirname, "localNews.json"))) {
      let newNews = [];
      fs.readFile(path.join(__dirname, "localNews.json"), (err, data) => {
        if (err) {
          console.log(err);
        } else {
          previousNews = JSON.parse(data);
          console.log(previousNews);
        }
      });
      for (let news of localNews) {
        if (!previousNews.some((elem) => elem.link == news.link)) {
          await LocalNews.create(news)
            .then((data) => {
              newNews.push(data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
      fs.writeFile(
        path.join(__dirname, "localNews.json"),
        JSON.stringify(newNews),
        (err) => {
          if (err) console.log(err);
        }
      );
    } else {
      let newNews = [];
      for (let news of localNews) {
        await LocalNews.create(news)
          .then((data) => {
            newNews.push(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      fs.writeFile(
        path.join(__dirname, "localNews.json"),
        JSON.stringify(newNews),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    //console.log(previousNews)
    //console.log(localNews);
    await browser.close();
  } catch (error) {
    return error;
  }
};

module.exports = localScrape;
// localScrape().then(()=>{
// console.log('Successfully scraped the website')
// }).catch((err)=>console.log(err));
