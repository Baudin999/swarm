import React from "react";

export default function Author({ organisation, author }) {
    if (author.html) {
        return (
            <div className="blog">

                <h1>Blog posts</h1>
                <ul>
                    {author.blogs.map(blog => {
                        return <li key={blog.url}><a href={blog.url}>{blog.title}</a></li>;
                    })}
                </ul>

                <div dangerouslySetInnerHTML={{ __html: author.html }} />

            </div>
        );
    }
    return (
        <div className="blog">
            <h1>{author.name}</h1>

            {author.image &&
                <div style={{ maxWidth: "150px" }}>
                    <img src={author.image} />
                </div>
            }

            <div>
                <span>Works for: </span>
                <a href={`/${organisation.id}`}>{organisation.name}</a>
            </div>
            <ul>
                {author.blogs.map(blog => {
                    return <li key={blog.id}><a href={`/${organisation.id}/${author.id}/${blog.id}/`}>{blog.title}</a></li>;
                })}
            </ul>
        </div>
    );
}