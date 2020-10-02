const puppetter = require('puppeteer');
const InternationalNews = require('../models/internationalNews')
const fs = require('fs')
const path = require('path')
const interScrape =  async () => {
    const browser = await puppetter.launch({headless:true,args:['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto('https://www.bbc.com/news/world', {timeout: 0, waitUntil: 'networkidle0'});
  
    let previousNews;
   const interNews = await page.evaluate(() => {
     const news = []
     document.querySelectorAll('article.lx-stream-post').forEach((el,i)=>{
       
       if(el.querySelector('div.lx-stream-post__body  .lx-stream-asset--story .lx-stream-asset__media  .lx-media-asset__body  .qa-image-link')){
           
           let time = el.querySelector('div.lx-stream-post__meta').textContent.match(/[0-9]+:[0-9]+/)[0]
           let title = el.querySelector('header.lx-stream-post__header  div  .lx-stream-post__header-title  a  span').textContent
           let img = new String(el.querySelector('div.lx-stream-post__body  div.lx-stream-asset--story div div figure.lx-stream-asset__media  .lx-media-asset__body .qa-image-link  .lx-media-asset__image  img').getAttribute('data-src')).replace('{width}','240')
           let link = el.querySelector('div.lx-stream-post__body  .lx-stream-asset--story .lx-stream-asset__media  .lx-media-asset__body  .qa-image-link').getAttribute('href')
           let content = el.querySelector('div.lx-stream-post__body  div.lx-stream-asset--story  div  div  p.qa-sty-summary').textContent
   
           news.push({time,title,img,link,content})
          }
          else if(el.querySelector('div.lx-stream-post__body  div.lx-stream-post-body figure.lx-media-asset div.lx-media-asset__body div.lx-media-asset__image img')){
           let time = el.querySelector('div.lx-stream-post__meta').textContent.match(/[0-9]+:[0-9]+/)[0]
           let title = el.querySelector('header.lx-stream-post__header div .lx-stream-post__header-title span').textContent
           let img = new String(el.querySelector('div.lx-stream-post__body  div.lx-stream-post-body figure.lx-media-asset div.lx-media-asset__body div.lx-media-asset__image img').getAttribute('data-src')).replace('{width}','240')
           let content = el.querySelector('div.lx-stream-post__body div  div.lx-stream-post-body p').textContent
   
           news.push({time,title,img,content})
          }
          else if(el.querySelector('div.lx-stream-post__body  div.lx-stream-post-body div.lx-stream-post-body__embed a')){
            let time = el.querySelector('div.lx-stream-post__meta').textContent.match(/[0-9]+:[0-9]+/)[0]
            let title = el.querySelector('header.lx-stream-post__header div .lx-stream-post__header-title  span').textContent
            let link = el.querySelector('div.lx-stream-post__body  div.lx-stream-post-body div.lx-stream-post-body__embed a').getAttribute('href')
            let content = el.querySelector('div.lx-stream-post__body div  div.lx-stream-post-body p').textContent
            news.push({time,title,content,link})
          }
   
   })
   return news
   })

   if(fs.existsSync(path.join(__dirname,'interNews.json'))){
    let newNews = []
    fs.readFile(path.join(__dirname,'interNews.json'), (err, data) => {
        if(err){
            console.log(err)
        }else{
            previousNews = JSON.parse(data);
        }
    } )
    for(let news of interNews){
        if(checkNews(previousNews,news)){
            await InternationalNews.create(news)
            .then((data  => {
                newNews.push(data)
            })).catch(err => {
                console.log(err)
            })
        }
}
    fs.writeFile(path.join(__dirname,'interNews.json'), JSON.stringify(newNews), err => {
        if(err) console.log(err);
    })
}else{
    let newNews = []
    for(let news of interNews){
        await InternationalNews.create(news)
         .then((data  => {
            newNews.push(data)
        })).catch(err => {
            console.log(err)
        })
    }
    fs.writeFile(path.join(__dirname,'interNews.json'), JSON.stringify(newNews), err => {
        if(err) console.log(err);
    })
}

//    console.log(interNews);
    await browser.close();
}

module.exports = interScrape

// interScrape().then(()=>{
//     console.log('Scraped Sccussesfully with no error')
// }).catch(err => {
//     console.log(err)
// })


const checkNews = (previousNew, news) => {

    if(news.img && news.link){
        return !previousNews.some(elem => elem.link == news.link)
    }else if(news.img && !news.link){
        return !previousNews.some(elem => elem.img == news.img)
    }else if(!news.img && news.link){
        return !previousNews.some(elem => elem.link == news.link)
    }
}