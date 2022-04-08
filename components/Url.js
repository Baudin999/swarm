import { getSettings } from '../tools/swarm.settings';

export default (path, baseUrl) => {

    let settings = getSettings();

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

    if (!path.startsWith('.')) path = '.' + path;

    return new URL(`${path}`, baseUrl).toString();
};