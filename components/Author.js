import React from "react";

const AuthorBlogs = function({ blogs }) {
    return (
        <>
            <h2>Blog posts</h2>
            <ul>
                {blogs.map(blog => {
                    return <li className="blog-list-item" key={blog.url}><a href={blog.url}>{blog.title}</a></li>;
                })}
            </ul>
        </>
    );
}

const AuthorHeading = function({author}) {
    return (
        <>
            <h2>{author.name}</h2>
            {author.description && <div className="author-page--content--description">{author.description}</div>}
            {author.html && <div dangerouslySetInnerHTML={{ __html: author.html }} />}
        </>
    );
}

export default function Author({ organisation, author }) {
    return (
        <div className="author-page">
            <div className="author-page--content">
                <AuthorHeading author={author} />
            </div>
            <div className="author-page--recent-blogs">
                <AuthorBlogs blogs={author.blogs} />
            </div>
        </div>
    )
}