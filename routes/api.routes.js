const express = require('express')
const LocalNews = require('../models/localNews')
const InternationalNews = require('../models/internationalNews')

const router = express.Router()

router.get('/local', async (req,res,next) => {
    await LocalNews.find().then(news =>{
        res.send({
            result: [...news],
            from: req.baseUrl,
            result_count: news.length
        })
    })
    next()
    
})

router.get('/international', async (req,res,next) => {
    await InternationalNews.find().then(news =>{
        res.json({
            result: [...news],
            from: req.baseUrl,
            result_count: news.length
        })
    })
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