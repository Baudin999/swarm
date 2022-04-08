
import React from "react";
import { getAllBlogs } from "./globalState";

export default function Tag({ tag }) {
    let allBlogs = getAllBlogs();

    return (
        <div className="tag-container">
            <div className="tag-container--inner">
                <h1>{tag}</h1>
                <ul>
                    {allBlogs.map(blog => (
                        <li key={blog.id}><a href={blog.url}>{blog.title}</a></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}