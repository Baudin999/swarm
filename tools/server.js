var express = require('express');
var path = require('path');
const pwd = process.cwd();
const rootDir = pwd;
const distDir = path.join(rootDir, 'dist');

var app = express();

app.use(express.static(distDir));

app.listen(3000, () => {
    console.log('Server listening on: http://localhost:3000');
});