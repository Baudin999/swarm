var express = require('express');
var path = require('path');
const pwd = process.cwd();
const rootDir = pwd;
const distDir = path.join(rootDir, 'dist');

var config = require("./../app.config.json");

var app = express();



app.post('/return', (req, res, next) => {
    console.log(req.headers);
    throw 'breaking application';
});


const loggerMiddleware = (req, res, next) => {
    //console.log(req.path);
    next();
}

app
    .use(loggerMiddleware)
    .use(express.static(distDir));

app.listen(3000, () => {
    console.log('Server listening on: http://localhost:3000');
});