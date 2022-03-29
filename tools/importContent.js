import fs from 'fs';
import cmd from 'node-cmd';
import fsExtra from 'fs-extra';
import { join } from 'path';

function getUserNameFromGithubUrl(url) {
    // example: https://github.com/Baudin999/swarm-content.git
    var parts = url.split('\/');
    var user = parts[3];
    var result = user;
    return result;
}
function fileNameToUrl(fileName) {
    return fileName.replace(/___/g, '/');
}

function getContentFromRepos(dir) {
    if (!dir) throw 'Should supply a directory on which to run the imports.';

    const tempDir = join(dir, 'temp');
    const contentDir = join(dir, 'content');
    const configPath = join(dir, 'app.config.json');

    if (!fs.existsSync(configPath)) {
        throw '"app.config.json" does not exists. Cannot pull from sources.';
    }

    fsExtra.remove(contentDir, () => {

        var configJson = fs.readFileSync(join(dir, 'app.config.json'), 'utf8');
        var config = JSON.parse(configJson);

        if (!fs.existsSync(tempDir)) {
            fsExtra.mkdirpSync(tempDir);
        }
        if (!fs.existsSync(contentDir)) {
            fsExtra.mkdirpSync(contentDir);
        }
        let srcConfig;
        if (config) srcConfig = config;
        else srcConfig = { sources: [] };

        var promises = srcConfig.sources.map(source => {
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
