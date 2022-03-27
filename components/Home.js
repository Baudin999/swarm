

import React from "react";

export default function Home({ orgs }) {
    return (
        <>
            <h1>Welcome to swarm</h1>
            <ul>
                {orgs.map(org => {
                    return <li key={org.id}><a href={`/${org.id}`}>{org.name}</a></li>;
                })}
            </ul>
        </>
    );
}