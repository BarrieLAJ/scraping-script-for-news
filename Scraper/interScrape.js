const puppetter = require("puppeteer");
const InternationalNews = require("../models/internationalNews");

//const fs = require("fs");
//const path = require("path");

// news api key = "6b049b3c0ee24797b9e2b5ab9d4bda32"
// BBC news api
// main_url = "http://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey="

const interScrape = async () => {

    const browser = await puppetter.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("https://www.bbc.com/news/world", {
      timeout: 0,
      waitUntil: "networkidle0",
    });

    let previousNews;
    const interNews = await page.evaluate(() => {
      const news = [];
      document.querySelectorAll("article.lx-stream-post").forEach((el, i) => {
        if (
          el.querySelector(
            "div.lx-stream-related-story a.qa-story-image-link div img"
          )
        ) {
          // title
          let time = el
            .querySelector("time.lx-stream-post__meta-time span")
            .textContent.match(/[0-9]+:[0-9]+/)[0];

          let title = el.querySelector(
            "header.lx-stream-post__header div h3.lx-stream-post__header-title a.lx-stream-post__header-link span.lx-stream-post__header-text"
          ).textContent;

          // img
          let img = `${el
            .querySelector(
              "div.lx-stream-related-story a.qa-story-image-link div img"
            )
            .getAttribute("src")}`;
          // .replace("{width}", "240")

          // content
          let content = el.querySelector(
            "div.lx-stream-related-story p.lx-stream-related-story--summary"
          ).textContent;

          //link
          let link = el
            .querySelector("div.lx-stream-related-story a.qa-story-cta-link")
            .getAttribute("href");

          news.push({ time, title, img, link, content });
        }
      });
      return news;
    });

    await browser.close();

    // if (fs.existsSync(path.join(__dirname, "interNews.json"))) {
    //   let newNews = [];
    //   fs.readFile(path.join(__dirname, "interNews.json"), (err, data) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       previousNews = JSON.parse(data);
    //     }
    //   });
    //   for (let news of interNews) {
    //     if (checkNews(previousNews, news)) {
    //       await InternationalNews.create(news)
    //         .then((data) => {
    //           newNews.push(data);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     }
    //   }
    //   fs.writeFile(
    //     path.join(__dirname, "interNews.json"),
    //     JSON.stringify(newNews),
    //     (err) => {
    //       if (err) console.log(err);
    //     }
    //   );
    // } else {
    //   let newNews = [];
    //   for (let news of interNews) {
    //     await InternationalNews.create(news)
    //       .then((data) => {
    //         newNews.push(data);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    //   fs.writeFile(
    //     path.join(__dirname, "interNews.json"),
    //     JSON.stringify(newNews),
    //     (err) => {
    //       if (err) console.log(err);
    //     }
    //   );
    // }

    return interNews;
};


const checkNews = (previousNews, news) => {
  if (news.img && news.link) {
    return !previousNews.some((elem) => elem.link == news.link);
  } else if (news.img && !news.link) {
    return !previousNews.some((elem) => elem.img == news.img);
  } else if (!news.img && news.link) {
    return !previousNews.some((elem) => elem.link == news.link);
  }
};


module.exports = interScrape;


