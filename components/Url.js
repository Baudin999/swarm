import {getSettings} from '../tools/swarm.settings';

export default (path) => {
    const baseUrl = getSettings().baseUrl || 'http://127.0.0.1:3000/';
    return new URL(`.${path}`, baseUrl);
}