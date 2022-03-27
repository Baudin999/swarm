import React from "react";

export default function Organisation({ organisation }) {
    if (organisation.html) {
        return (
            <>
                {organisation.html && <div dangerouslySetInnerHTML={{ __html: organisation.html }} />}

                <h1>Authors</h1>
                <ul>
                    {organisation.authors.map(author => {
                        return <li key={author.id}><a href={`/${organisation.id}/${author.id}/`}>{author.name}</a></li>;
                    })}
                </ul>
            </>
        );    
    }
    else {
        return (
            <>
                <h1>{organisation.name}</h1>
                <ul>
                    {organisation.authors.map(author => {
                        return <li key={author.id}><a href={`/${organisation.id}/${author.id}/`}>{author.name}</a></li>;
                    })}
                </ul>
            </>
        );
    }
}