
import React from "react";
import { getAllBlogs } from "./globalState";
import BlogItems from "./BlogItems";

export default function Tag({ tag }) {
    let allBlogs = getAllBlogs();

    return (
        <div className="tag-container">
            <div className="tag-container--inner">
                <h1>{tag}</h1>
                <ul>
                    <BlogItems blogs={allBlogs} />
                </ul>
            </div>
        </div>
    );
}