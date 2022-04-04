

import React from "react";
import stateContainer from "./globalState";

export default function Home({ orgs }) {
    let allBlogs = stateContainer.getState('all_blogs');
    var authors = orgs.map(org => org.authors).flat(1);

    // console.log(allBlogs);

    var [first, ...rest] = allBlogs;

    return (
        <div className="home">
            <h1>Welcome to swarm</h1>

            <div className="home--top-panel">
                <div className="home--top-panel--left" style={{ background: 'url("/home-01.jpeg")' }}>
                    <a href={first.url}>
                        <div>{first.title}</div>
                        <div>{first.author}</div>
                    </a>
                </div>
                <div className="home--top-panel--right">
                <h2>All the blogs</h2>
                    <ul>
                        {allBlogs.map(blog => {
                            return <li key={blog.id}><a href={blog.link}>{blog.author_name} - {blog.title}</a></li>;
                        })}
                    </ul>
                </div>
            </div>


            <h2>All the organisations</h2>
            <ul>
                {orgs.map(org => {
                    return <li key={org.id}><a href={`/${org.id}`}>{org.name}</a></li>;
                })}
            </ul>

            <h2>All the authors</h2>
            <ul>
                {authors.map(author => {
                    return <li key={author.id}><a href={`/${author.org_id}/${author.id}`}>{author.name}</a></li>;
                })}
            </ul>

            <h2>All the blogs</h2>
            <ul>
                {allBlogs.map(blog => {
                    return <li key={blog.id}><a href={blog.link}>{blog.author_name} - {blog.title}</a></li>;
                })}
            </ul>
        </div>
    );
}