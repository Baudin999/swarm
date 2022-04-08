class BaseModel {

    constructor(data) {
        this.data = data
        return this.proxy(data);
    }

    proxy(data) {
        let proxyHandler = {
            get(target, prop) {
                if (Object.getPrototypeOf(target).hasOwnProperty(prop)) {
                    return target[prop];
                }
                if (data.hasOwnProperty(prop)) {
                    return data[prop];
                }
                return undefined;
            }
        }
        return new Proxy(this, proxyHandler)
    }
}

export default BaseModel;