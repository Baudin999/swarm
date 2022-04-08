import React from "react";
import BlogItems from "./BlogItems";
import { getBlogByTag } from "./globalState";


export default function Tag({ tag }) {
    let allBlogsWithTag = getBlogByTag(tag);

    return (
        <div className="tag-container">
            <div className="tag-container--inner">
                <h1>{tag}</h1>
                <BlogItems blogs={allBlogsWithTag} />
            </div>
        </div>
    );
}