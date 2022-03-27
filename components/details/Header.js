import React from "react";
import stateContainer from "../globalState";


export default function Header() {
    var organisations = stateContainer.getState('orgs') || [];

    return (
        <div className="header">
            <div className="header-root">
                <a href="/">
                <img src="/mars.png" />
                </a>
            </div>

            <div className="header-nav">
                <ul>
                    <li><a href="/">Organisations</a></li>
                    {organisations.map(org => {
                        return <li key={org.id}><a href={`/${org.id}`}>{org.name}</a></li>
                    })}
                </ul>
            </div>
        </div>
    );
}

