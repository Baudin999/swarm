import { getSettings } from '../tools/swarm.settings';

export default (path, baseUrl) => {

    if (!global.isProduction && !baseUrl) baseUrl = 'http://127.0.0.1:3000/';

    let settings = getSettings();
    if (baseUrl && !baseUrl.startsWith('.') && !baseUrl.startsWith('http'))
        baseUrl = '.' + baseUrl;
    if (!baseUrl)
        baseUrl = settings.baseUrl || 'http://127.0.0.1:3000/';

    if (!path.startsWith('.')) path = '.' + path;

    return new URL(`${path}`, baseUrl).toString();
};