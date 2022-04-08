
import React from "react";
import { getBlogByTag } from "./globalState";

export default function Tag({ tag }) {
    let allBlogsWithTag = getBlogByTag(tag);

    return (
        <div className="tag-container">
            <div className="tag-container--inner">
                <h1>{tag}</h1>
                <ul>
                    {allBlogsWithTag.map(blog => (
                        <li key={blog.id}><a href={blog.url}>{blog.title}</a></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}