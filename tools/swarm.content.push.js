import fs from 'fs';
import cmd from 'node-cmd';
import fsExtra from 'fs-extra';
import { join } from 'path';
import { configName, rootDir, distDir } from './swarm.settings.js';


function run() {

    var configJson = fs.readFileSync(join(rootDir, configName), 'utf8');
    var config = JSON.parse(configJson);

    if (!config.publish) {
        console.log("No repository to publish to.");
        return;
    }

    cmd.run(`cd ${distDir} && git init`, () => {
        console.log("Initializaed git repository.");
        cmd.run(`cd ${distDir} && git remote add origin ${config.publish}`, () => {
            console.log("Added remote origin: " + config.publish);
            cmd.run(`cd ${distDir} && git pull origin master`, () => {
                cmd.run(`cd ${distDir} && git add .`, () => {
                    cmd.run(`cd ${distDir} && git commit -m "pushish"`, () => {
                        cmd.run(`cd ${distDir} && git push -f origin master`, () => {
                            console.log("Successfully pushed to repository.");
                            // fsExtra.remove(join(distDir, '.git'));
                        });
                    });
                });
            });
        });

    });
}

export default run;