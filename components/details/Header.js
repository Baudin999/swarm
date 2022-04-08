import React from "react";
import stateContainer from "../globalState";


export default function Header() {
    var organisations = stateContainer.getState('orgs') || [];
    var currentUrl = stateContainer.getState('currentUrl');
    var tags = stateContainer.getState('tags') || [];

    return (
        <div className="header">
            <div className="header-nav">
                <ul>
                    <li className="header-nav--logo">
                        <a href="/">
                            <img src="/logo-essent.png" />
                        </a>
                    </li>
                    {/* <li className={currentUrl === "" || currentUrl === '/' ? 'selected' : ''} >
                        <a href="/">Home</a>
                    </li> */}
                    {tags.map(tag => {
                        return (
                            <li className={currentUrl.startsWith(tag) ? 'selected' : ''}
                                key={tag}>
                                <a href={"/" + tag + ".html"}>{tag}</a >
                            </li>
                        );
                    })}
                    <li><a href="/search.html">Search</a></li>
                </ul>

            </div>
        </div>
    );
}

