'use strict'
const fs = require('fs')
const express = require('express')
const config = require('./configs').config
const watchfile = require('./configs').watchfile
const bodyParser = require('body-parser')
const servControl = require('./control')
const chokidar = require('chokidar')
const pathhtml = config.wwwroot
const hostname = config.hostname
const pathlogfile = watchfile.logfile
const port = config.port
const app = express()
const models = require('./models')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/', express.static(pathhtml))

app.get('/', (req, res) => {
    res.sendFile(pathhtml + '/index.html')
})

GetArrayFromLines(pathlogfile)

app.post('/srv/:mode', (req, res) => {
    var mode = req.params.mode
    switch (mode) {
        case 'dataminer':
            servControl.Dataminer(res, models.DataMiner)
            break
        default:
            res.sendFile(__dirname + '/pages/nomode.html')
    }

})
app.get('/srv/:mode', (req, res) => {
    res.sendFile(__dirname + '/pages/nopost.html')
})

app.listen(port, hostname, () => {
    var timestart = Date(Date.now()).toString()
    console.log(`Server BERYLLIUM started on port ${port} and ${hostname} hostname at ${timestart}`)
})

const watcher = chokidar.watch(pathlogfile, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignorePermissionErrors: false
});
watcher.on('change', (path) => {
    GetArrayFromLines(path)
})

function GetArrayFromLines(path) {
    var input = fs.readFile(path, (err, data) => {
        models.DataMiner.lines = []
        if (err) throw err;
        var array = data.toString().split("\r\n");
        for (var i = array.length; i >= 0; i--) {
            models.DataMiner.lines.push(array[i - 1]);
        }

    })
}


