import fs from 'fs';
import path from 'path';
import { configName } from './../../tools/swarm.settings.js';

export function getSwarmConfig(sourcePath) {
    // init config
    var configPath = path.join(sourcePath, configName);
    var config;
    if (fs.existsSync(configPath)) {
        config = require(configPath);
    }
    else {
        //console.log('could not find config');
    }

    if (!config) config = {};
    if (!config.sources) config.sources = [];

    return config;
};

export function saveSwarmConfig(sourcePath, config) {
    var configPath = path.join(sourcePath, configName);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
};

export function listSources(sourcePath) {
    // get the config
    var config = getSwarmConfig(sourcePath);

    if (config.sources.length === 0) {
        console.log("No sources avaiable");
    }
    else {
        console.log();
        console.log("Listing sources at: " + sourcePath);
        config.sources.forEach(source => {
            console.log(source);
        });
    }
};
