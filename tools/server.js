const express = require('express');
const path = require('path');
import { rootDir } from './swarm.settings';


function getStaticPathFromGithubUrl(url, dir) {
    // example: https://github.com/Baudin999/swarm-content.git
    var parts = url.split('\/');
    var user = parts[3];
    var repo = parts[4].replace('.git', '');

    return path.join(dir, user, repo);
}

export default function (dir) {
    let distDir = path.join(dir || rootDir, 'dist');

    var app = express();

    const loggerMiddleware = (req, res, next) => {
        console.log(req.path);
        next();
    };

    app
        .use(loggerMiddleware)
        .use(express.static(distDir));


    app.listen(3000, (e) => {
        console.log('Server listening on: http://localhost:3000');
    });
}

