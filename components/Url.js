import { getSettings } from '../tools/swarm.settings';

export default (path, baseUrl) => {

    let settings = getSettings();


    if (global.isDev) {
        if (baseUrl) {
            if (baseUrl.startsWith('http')) {
                return new URL(`${path}`, baseUrl).toString();
            }
            else {
                if (!baseUrl.endsWith('/')) baseUrl += '/';
                return `${baseUrl}${path}`;
            }
        } else {
            return path;
        }
    }


    // get the key with which toi prefix the url from 
    // the swarm settings file
    if (global.configKey && settings[global.configKey]) {
        let configKey = settings[global.configKey];

        if (configKey === '.' && baseUrl) {
            if (baseUrl.startsWith('http')) {
                return new URL(`${path}`, baseUrl).toString();
            }
            else {
                if (!baseUrl.endsWith('/')) baseUrl += '/';
                return `${baseUrl}${path}`;
            }
        } else if (configKey === '.') {
            return path;
        }
    }


    if (!baseUrl) {
        if (global.isProduction) {
            baseUrl = settings.baseUrl;
        }
        else {
            baseUrl = 'http://127.0.0.1:3000/';
        }
    }

    if (baseUrl && !baseUrl.startsWith('.') && !baseUrl.startsWith('http'))
        baseUrl = '.' + baseUrl;


    if (path && !path.startsWith('.')) path = '.' + path;


    return new URL(`${path}`, baseUrl).toString();
};