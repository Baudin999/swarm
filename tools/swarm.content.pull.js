import fs from 'fs';
import cmd from 'node-cmd';
import fsExtra from 'fs-extra';
import { join } from 'path';
import { configName, contentDir, getSettings } from './swarm.settings.js';

function getUserNameFromGithubUrl(url) {
    if (url.startsWith("https")) {
        // example: https://github.com/Baudin999/swarm-content.git
        var parts = url.split('\/');
        var user = parts[3];
        var result = user;
        return result;
    }
    else if (url.startsWith("git@")) {
        // example: git@github.com:Baudin999/swarm-techlab-content.git
        var parts = url.split('/')[0];
        var user = url.split(':')[1];
        return user;
    }
}
function fileNameToUrl(fileName) {
    return fileName.replace(/___/g, '/');
}

function getContentFromRepos(dir) {
    if (!dir) throw 'Should supply a directory on which to run the imports.';

    const tempDir = join(dir, 'temp');
    const configPath = join(dir, configName);
    const settings = getSettings();

    fsExtra.remove(contentDir, () => {

        // var configJson = fs.readFileSync(join(dir, configName), 'utf8');
        // var config = JSON.parse(configJson);

        if (!fs.existsSync(tempDir)) {
            fsExtra.mkdirpSync(tempDir);
        }
        if (!fs.existsSync(contentDir)) {
            fsExtra.mkdirpSync(contentDir);
        }

        var promises = settings.sources.map(source => {
            return new Promise((res) => {
                try {
                    // setup
                    const pathName = getUserNameFromGithubUrl(source);
                    const cloneDir = join(tempDir, pathName);

                    if (!fs.existsSync(cloneDir)) fsExtra.mkdirSync(cloneDir);

                    // async calls
                    console.log(`Cloning into: ${cloneDir}`);
                    cmd.run(`cd ${cloneDir} && git clone ${source}`, () => {
                        fsExtra.copy(tempDir, contentDir, () => {
                            console.log(`Successfully cloned ${source} to ${contentDir}`);
                            res();
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
    });
}

export default getContentFromRepos;
