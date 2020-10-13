const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const localScrape = require("./Scraper/localScrape");
const interScrape = require("./Scraper/interScrape");

//connect to mongoDB
mongoose
  .connect(
    "mongodb+srv://alhaji_b:alhaji@1999@@sabisalonenews.vzeuw.gcp.mongodb.net/news?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((res) => console.log("DB Connected successfully"));

// scrapering
const doScraping = async () => {
   localScrape()
    .then(() => {
      console.log("Scraping local news Was Successful");
    })
    .catch((err) => {
      console.log(`Error Scraping local Site ${err}`);
      return err
    });

   interScrape()
    .then(() => {
      console.log("Scraping International news Was Successful");
    })
    .catch((err) => {
      console.log(`Error Scraping international Site ${err}`);
      return err
    });
};

//setting interval for scraping
setInterval(() => {
  doScraping()
    .then(() => {
      console.log("Scraping Done");
    })
    .catch((err) => {
      console.log(`There was an error ${err}`);
    });
}, 1000);

// 1800000

//routes
const indexRoute = require("./routes/indexRout.routes");
const apiRoutes = require("./routes/api.routes");

const PORT = process.env.port || 3000;

//middlewares
app.use(bodyParser.json());

//setting routes
app.get("/", (req, res) => {
  res.json({ ok: req.header });
});
app.use("/api/news", apiRoutes);

//error handling middlewares
app.use((err, req, res, next) => {
  // console.log(err)
  res.status(412).send({ errMsg: err.message });
  next();
});

//update database after get request
// app.use((req,res,next)=>{

//    if(req.method === "GET" && req.url == "/api/news/local"){
//       console.log('Entering scraper...')
//       let num = 0
//       if(!(num <= 10)){
//         num++
//       }else if(num == 10){

//       }

//  }
//  else if(req.method === "GET" && req.url === "/api/news/international"){
//    console.log('Entering International Scraper')
//    let num = 0;
//    if(!(num <= 10)){
//     num++
//   }else if(num == 10){

//   }
// }

// next();
// })

app.listen(PORT, () => {
  console.log("Innitializing.....");
  console.log("Starting the server....");
  console.log("Server started..");
  console.log("Server Listening on port 4000");
});
