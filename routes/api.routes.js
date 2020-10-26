const express = require('express')
const LocalNews = require('../models/localNews')
const InternationalNews = require('../models/internationalNews')

const localScrape = require("../Scraper/localScrape");
const interScrape = require("../Scraper/interScrape");

const router = express.Router()

router.get('/local', (req,response) => {
     localScrape().then(res => res).then(data => {
        response.json({
                    result: [...data],
                    from: req.baseUrl,
                    result_count: data.length
                })
    }).catch(err => {
        response.status(500).send({
            err: err,
            message: "internal server error"
        })
    })

    // await LocalNews.find().then(news =>{
    //     res.send({
    //         result: [...news],
    //         from: req.baseUrl,
    //         result_count: news.length
    //     })
    // })
    //next()
    
})

router.get('/international', (req,response) => {
     interScrape().then(res => res).then(data => {
        response.json({
                    result: [...data],
                    from: req.baseUrl,
                    result_count: data.length
                })
    }).catch(err => {
        response.status(500).send({
            err: err,
            message: "internal server error"
        })
    })

    // await InternationalNews.find().then(news =>{
    //     res.json({
    //         result: [...news],
    //         from: req.baseUrl,
    //         result_count: news.length
    //     })
    // })
    
})


router.post('/local', async (req,res,next) => {
    await LocalNews.create(req.body)
    .then((local)=>{
        res.json(local)
    })
    .catch((err)=>{
        console.log(err)
    })
    next()
})

router.post('/international', async (req,res,next) => {
    await InternationalNews.create(req.body)
    .then((international)=>{
        res.send(international)
    }).catch(next)
})

module.exports = router;