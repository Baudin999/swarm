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

                    <li>
                        <ul className="tags">
                            {tags.map((tag, i) => {
                                return (

                                    <li className={currentUrl.startsWith(tag) ? 'selected' : ''}
                                        key={tag}>
                                        <div>
                                            {i > 0 && <span className="separator">&nbsp;|&nbsp;</span>}
                                            <a className="hover" href={"/" + tag + ".html"}>{tag}</a >
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                    <li><a href="/search.html">Search</a></li>
                </ul>

            </div>
        </div>
    );
}

