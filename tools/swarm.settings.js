import path from 'path';

/*
This file contains the settings of the swarm application.
*/

export const configName = 'swarm.config.json';


/*
Export the root directory and all of the other functional
directories of swarm from this single file.
*/

export const rootDir = process.cwd();
export const distDir = path.join(rootDir, 'dist');

