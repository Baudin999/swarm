import React from "react";

export default function Blog({ organisation, author, blog }) {
    // console.log(blog)
    // console.log(author)
    return (
        <div className="blog">
            <div className="blog--title">{blog.title}</div>
            {blog.description &&  <div className="blog--description">{blog.description}</div>}

            <div className="blog--title-bar">
                <div className="blog--title-bar--author-pill"><img src={author.image} alt="something"/></div>
                <div className="blog--title-bar--organisation">
                    <a href={`/${organisation.id}`}>{organisation.name}</a>
                </div>
                <span className="sep">|</span>
                <div className="blog--title-bar--author">
                    <a href={`/${organisation.id}/${author.id}`}>{author.name}</a>
                </div>
                <span className="sep">|</span>
                <div className="blog--title-bar--read-time">
                    2 minuten
                </div>
                <span className="sep">|</span>
                <div className="blog--title-bar--date">
                    {blog.date}
                </div>
            </div>

            <div>
                <div dangerouslySetInnerHTML={{ __html: blog.html }} />
            </div>
        </div>
    );
}