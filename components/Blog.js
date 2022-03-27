import React from "react";

export default function Blog({ organisation, author, blog }) {
    return (
        <>
            <h1>{blog.title}</h1>

            <div>
                <div><a href={`/${organisation.id}`}>To organisation: {organisation.name}</a></div>
                <div><a href={`/${organisation.id}/${author.id}`}>To author: {author.name}</a></div>
            </div>

            <div>
                <div dangerouslySetInnerHTML={{ __html: blog.html }} />
            </div>
        </>
    );
}