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

    var promises = config.sources.map(source => {
        return new Promise((res) => {
            try {
                // setup
                const rand = Math.random().toString(16).substr(2, 8); // generate unique id, example: 6de5ccda
                const cloneDir = join(tempDir, rand);
                const gitDir = join(cloneDir, '.git');

                // async calls
                console.log(`Cloning into: ${gitDir}`);
                cmd.run(`cd ${tempDir} && git clone ${source} ${rand}`, () => {
                    fsExtra.remove(gitDir, () => {
                        fsExtra.copy(cloneDir, contentDir, () => {
                            console.log(`Successfully cloned ${source} to ${contentDir}`);
                            res();
                        });
                    });
                });
            } catch (e) {
                console.log(e);
                res();
            }
        });
    });

    Promise.all(promises).then(() => {
        fsExtra.remove(tempDir);
    });
}

export default getContentFromRepos();
