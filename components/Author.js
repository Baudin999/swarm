import React from "react";

const AuthorBlogs = function ({ blogs }) {
    return (
        <>
            <h2>Blog posts</h2>
            <ul>
                {blogs.map(blog => {
                    return (
                        <li className="blog-list-item" key={blog.url}>
                            <div>
                                <a href={blog.url}>
                                    <div className="blog-list-item--title">{blog.title}</div>
                                    <div className="blog-list-item--date">{blog.date}</div>
                                </a>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

const AuthorHeading = function ({ author }) {
    return (
        <>
            {author.html && <div dangerouslySetInnerHTML={{ __html: author.html }} />}
            {!author.html && <h2>{author.name}</h2>}
            {!author.html && author.description && <div className="author-page--content--description">{author.description}</div>}
            {!author.html && author.image && <img src={author.image} />}
        </>
    );
};


export default function Author({ organisation, author }) {
    return (
        <div className="author-container">
            <div className="author-page">
                <div className="author-page--content">
                    <AuthorHeading author={author} />
                </div>
                <div className="author-page--recent-blogs">
                    <AuthorBlogs blogs={author.blogs} />
                </div>
            </div>
        </div>
    );
}