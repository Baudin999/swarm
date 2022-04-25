import React from "react";
import Image from './details/Image';
import BlogItems from "./BlogItems";


const AuthorHeading = function ({ author }) {
    return (
        <>
            {author.html && <div dangerouslySetInnerHTML={{ __html: author.html }} />}
            {!author.html && <h2>{author.name}</h2>}
            {!author.html && author.description && <div className="author-page--content--description">{author.description}</div>}
            {!author.html && author.image && <Image src={author.image} />}
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
                <div className="author-page--blogs">
                    <h2>Blog posts</h2>
                    <BlogItems blogs={author.blogs} />
                </div>

            </div>
        </div>
    );
}