import fs from 'fs';
import config from '../app.config.json';
import cmd from 'node-cmd';
import fsExtra from 'fs-extra';
import { join } from 'path';

// some setup to get to the root of the project
const __dirname = process.cwd();
const rootDir = __dirname; //join(__dirname, '..');
const tempDir = join(rootDir, 'temp');
const contentDir = join(rootDir, 'content');


function getContentFromRepos() {
    if (!fs.existsSync(tempDir)) {
        fsExtra.mkdirpSync(tempDir);
    }
    if (!fs.existsSync(contentDir)) {
        fsExtra.mkdirpSync(contentDir);
    }

    if (!config) config = {};
    if (!config.sources) config.sources = [];

    config.sources.forEach(source => {
        try {
            const rand = Math.random().toString(16).substr(2, 8); // 6de5ccda
            const clone = cmd.runSync(`cd ${tempDir} && git clone ${source} ${rand}`);
            const projectDir = join(tempDir, rand);
            fsExtra.copySync(projectDir, contentDir);
        } catch (e) {
            console.log(e);
        }
    });

    setTimeout(() => {
        fsExtra.remove(tempDir);
    }, 500);
}

getContentFromRepos();
