

import React from "react";
import stateContainer from "./globalState";

export default function Home({ orgs }) {
    let allBlogs = stateContainer.getState('all_blogs');
    var authors = orgs.map(org => org.authors).flat(1);

    var [first, ...rest] = allBlogs;
    var topFour = rest.slice(0, 4);

    return (
        <div className="home-container">
            <div className="home">
                <div className="home--top-panel">
                    <div className="home--top-panel--left">
                        <div className="home--top-panel--left--footer">
                            <a href={first.url}>
                                <div className="home--top-panel--left--footer--title"><h2>{first.title}</h2></div>
                                <div className="home--top-panel--left--footer--author">{first.author_name} | {first.author_role}</div>
                            </a>
                        </div>
                    </div>
                    <div className="home--top-panel--right">
                        <div className="home--top-panel--right--footer">
                            <h2 className="home--top-panel--right--footer--title">New Posts</h2>
                            <ul className="home--top-panel--right--footer--posts">
                                {topFour.map(blog => (
                                    <li key={blog.id}>
                                        <a href={blog.link}>{blog.author_name} - {blog.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}