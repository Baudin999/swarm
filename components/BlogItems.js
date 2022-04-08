import React from "react";
import BlogItem from "./BlogItem";

export default ({ blogs }) => {
    return (
        <ul className="blog-item--container">
            {blogs.map(blog => <div key={blog.id}><BlogItem blog={blog} /></div>)}
        </ul>
    );
};