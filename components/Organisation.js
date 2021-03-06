import React from "react";
import url from "./Url";

export default function Organisation({ organisation }) {
    if (organisation.html) {
        return (
            <div className="org-container">
                <div className="org">
                    {organisation.html && <div dangerouslySetInnerHTML={{ __html: organisation.html }} />}

                    <h2>Authors</h2>
                    <ul>
                        {organisation.authors.map(author => {
                            return <li key={author.id}><a className="hover" href={url(`/${organisation.id}/${author.id}/`)}>{author.name}</a></li>;
                        })}
                    </ul>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="org-container">
                <div className="org">
                    <h2>{organisation.name}</h2>
                    <ul>
                        {organisation.authors.map(author => {
                            return <li key={author.id}><a className="hover" href={url(`/${organisation.id}/${author.id}/`)}>{author.name}</a></li>;
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

