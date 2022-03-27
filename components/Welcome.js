import React from "react";

export default function Welcome({ organisation, author, blog }) {
    return (
        <>
            <h1>{blog.title}</h1>

            <div>
                <div>{organisation.name}</div>
                <div>{author.name}</div>
            </div>

            <div>
                <div dangerouslySetInnerHTML={{ __html: blog.html }} />
            </div>
        </>
    );
}