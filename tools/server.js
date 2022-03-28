var express = require('express');
var path = require('path');


export default function (dir) {
    if (!dir) {
        const pwd = process.cwd();
        dir = rootDir = pwd;
    }
    let srcDir = path.join(dir, 'dist');

    var app = express();

    const loggerMiddleware = (req, res, next) => {
        //console.log(req.path);
        next();
    };

    app
        .use(loggerMiddleware)
        .use(express.static(srcDir));

    app.listen(3000, (e) => {
        console.log(e);
        console.log('Server listening on: http://localhost:3000');
    });
}

