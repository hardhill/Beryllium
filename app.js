'use strict'
const express = require('express')
const config = require('./configs').config
const bodyParser = require('body-parser')
const servControl = require('./control')
const Tile = require('tail').Tail
const pathhtml = config.wwwroot
const hostname = config.hostname
const port = config.port
const app = express()
const models = require('./models')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/',express.static(pathhtml))

app.get('/',(req,res)=>{
    res.sendFile(pathhtml+'/index.html')
})

app.post('/srv/:mode',(req,res)=>{
    var mode = req.params.mode
    switch (mode){
        case 'dataminer':
            servControl.Dataminer(res,models.DataMiner)
            break
        default:
            res.sendFile(__dirname+'/pages/nomode.html')    
    }
    
})
app.get('/srv/:mode',(req,res)=>{
    res.sendFile(__dirname+'/pages/nopost.html')
})

app.listen(port, hostname, ()=>{
    var timestart = Date(Date.now()).toString()
    console.log(`Server BERYLLIUM started on port ${port} and ${hostname} hostname at ${timestart}`)
})