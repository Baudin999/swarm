import fs from 'fs';
import path from 'path';

export function _getSwarmConfig(sourcePath) {
    // init config
    var configPath = path.join(sourcePath, "/app.config.json");
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

export function _saveSwarmConfig(sourcePath, config) {
    var configPath = path.join(sourcePath, "/app.config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
};

export function _listSources(sourcePath) {
    // get the config
    var config = _getSwarmConfig(sourcePath);

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
