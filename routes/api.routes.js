const express = require('express')
const LocalNews = require('../models/localNews')
const InternationalNews = require('../models/internationalNews')

const localScrape = require("../Scraper/localScrape");
const interScrape = require("../Scraper/interScrape");

const router = express.Router()

router.get('/local', async (req,res,next) => {
    await localScrape().then(news => {
        res.json({
                    result: [...news.data],
                    from: req.baseUrl,
                    result_count: news.data.length
                })
    }).catch(err => {

    })

    // await LocalNews.find().then(news =>{
    //     res.send({
    //         result: [...news],
    //         from: req.baseUrl,
    //         result_count: news.length
    //     })
    // })
    next()
    
})

router.get('/international', async (req,res,next) => {
    await interScrape().then(news => {
        res.json({
                    result: [...news.data],
                    from: req.baseUrl,
                    result_count: news.data.length
                })
    }).catch(err => {
        res.status(500).send({
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
    next()
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