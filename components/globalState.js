

let privateState = {};

let stateContainer =  {
    setState: function(key, value) {
        privateState[key] = value;
        return stateContainer;
    },
    getState: function(key) {
        return privateState[key];
    }

}

export default stateContainer;