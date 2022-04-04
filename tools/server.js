const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
import { rootDir, distDir } from './swarm.settings';


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

    app.use(express.json());

    const loggerMiddleware = (req, res, next) => {
        // console.log(req.path);
        next();
    };

    app.get('/hello', (req, res) => {
        res.end('world');
    });

    function slugToPath(slug) {
        return slug.replace(/\//g, '_').replace(/\\/g, '_');
    }

    app.get('/comments', (req, res) => {
        let { slug } = req.query;

        if (slug) {
            let commentPath = path.join(distDir, slugToPath(slug));
            if (fs.existsSync(commentPath)) {
                let commentContent = fs.readFileSync(commentPath, 'utf8');
                if (commentContent) {
                    res.send(commentContent);
                    return;
                }
            }
            else {
                fs.writeFileSync(commentPath, '[]');
                res.send([]);
                return;
            }
        }
        res.end('Errors');
    });

    app.post('/comments', (req, res) => {
        console.log(req.body);
        let { slug } = req.query;
        let comments = [];
        if (slug) {
            let commentPath = path.join(distDir, slugToPath(slug));
            if (fs.existsSync(commentPath)) {
                let commentContent = fs.readFileSync(commentPath, 'utf8');
                comments = JSON.parse(commentContent);
            }
            comments.push(req.body);
            console.log(comments);
            fs.writeFileSync(commentPath, JSON.stringify(comments, null, 4));
        }
        res.send({ status: 500 });
    });


    app
        .use(loggerMiddleware)
        .use(express.static(distDir));


    app.listen(3000, (e) => {
        console.log('Server listening on: http://localhost:3000');
    });
}

