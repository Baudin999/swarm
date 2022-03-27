import React from "react";

export default function Header() {
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
                </ul>
            </div>
        </div>
    );
}

