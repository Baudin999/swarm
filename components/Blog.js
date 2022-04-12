import React from "react";
import url from "./Url";
import Image from "./details/Image";

export default function Blog({ organisation, author, blog }) {

    return (
        <div className="blog-container">
            <div className="blog">
                <div className="blog--title">{blog.title}</div>
                {blog.description && <div className="blog--description">{blog.description}</div>}

                <div className="blog--title-bar">
                    <div className="blog--title-bar--author-pill"><Image src={author.image} alt="something" /></div>
                    <div className="blog--title-bar--organisation">
                        <a className="accented hover" href={url(`/${organisation.id}`)}>{organisation.name}</a>
                    </div>
                    <span className="sep">|</span>
                    <div className="blog--title-bar--author">
                        <a className="accented hover" href={url(`/${organisation.id}/${author.id}`)}>{author.name}</a>
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

                {blog.comments && (<>
                    <div id="comments" />
                    <script src="/comments.js"></script>
                </>)}
            </div>
        </div>
    );
}