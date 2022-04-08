

let privateState = {};

let stateContainer = {
    setState: function (key, value) {
        privateState[key] = value;
        return stateContainer;
    },
    getState: function (key) {
        return privateState[key];
    }

};

export default stateContainer;


export function getBlogByTag(tag) {
    let orderedBlogs = stateContainer.getState('all_blogs');
    let result = orderedBlogs.filter(blog => blog.tags.includes(tag.toLowerCase()));
    return result;
}
