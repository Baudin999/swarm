import React from "react";
import { getBlogByTag } from "./globalState";

export default function Tag({ tag }) {
    let allBlogsWithTag = getBlogByTag(tag);

    return (
        <div className="tag-container">
            <div className="tag-container--inner">
                <h1>{tag}</h1>
                <ul className="blog-item--container">
                    {allBlogsWithTag.map(blog => {
                        return (
                            <li key={blog.id}>
                                <a style={{ background: `url('${blog.imageUrl}')`, backgroundSize: 'cover' }} className="blog-item" href={blog.url}>
                                    <div className="blog-item--footer">
                                        <div className="blog-item--footer--title">
                                            {blog.title}
                                        </div>
                                        <div className="blog-item--footer--author">
                                            {blog.author}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}