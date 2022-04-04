import React from "react";
import stateContainer from "../globalState";


export default function Header() {
    var organisations = stateContainer.getState('orgs') || [];
    var currentUrl = stateContainer.getState('currentUrl');
    return (
        <div className="header">
            <div className="header-root">
                <a href="/">
                <img src="/mars.png" />
                </a>
            </div>
            <div className="header-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    {organisations.map(org => {
                        return (
                            <li className={currentUrl.startsWith(org.url) ? 'selected' : ''} 
                                key={org.id}>
                                <a href={org.url}>{org.name}</a>
                            </li>
                        )
                    })}
                    <li><a href="/styleguide.html">Style guide</a></li>
                </ul>
            </div>
        </div>
    );
}

