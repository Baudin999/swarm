import React from "react";

class Root extends React.Component {

    constructor(org, author, blog) {
        this.org = org;
        this.author = author;
        this.blog = blog;
    }

    render() {
        return <Welcome organisation={org} author={author} blog={blog} />;
    }
}

export default Root;