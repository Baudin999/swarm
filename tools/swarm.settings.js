import path from 'path';
import fs from 'fs';

/*
This file contains the settings of the swarm application.
*/

export const configName = 'swarm.config.json';


/*
Export the root directory and all of the other functional
directories of swarm from this single file.
*/

export const rootDir = process.cwd();
export const contentDir = path.join(rootDir, 'content');
export const distDir = path.join(rootDir, 'dist');
export const distPublicDir = path.join(rootDir, 'dist', 'public');


export const getSettings = () => {
    const settingsFile = path.join(rootDir, configName);
    if (!fs.existsSync(settingsFile)) {
        console.log(`No settings file found at ${settingsFile}.`);
        return { sources: [] };
    }
    return require(settingsFile);
};

