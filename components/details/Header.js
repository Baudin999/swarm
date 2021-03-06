import React from "react";
import stateContainer from "../globalState";
import url from "./../Url";
import Image from "./Image";

export default function Header() {
    let currentUrl = stateContainer.getState('currentUrl').toString();
    let tags = stateContainer.getState('tags') || [];


    return (
        <div className="header">
            <div className="header-nav">
                <ul>
                    <li className="header-nav--logo">
                        <div style={{paddingLeft: "3rem"}}>
                            <a href={url("/")}>
                                <Image src={url("/logo.png")} />
                            </a>
                        </div>
                    </li>

                    <li className="header-nav--tags">
                        <ul className="tags">
                            {tags.map((tag, i) => {
                                let tagUrl = url('/' + tag.toLowerCase());
                                return (
                                    <li className={currentUrl.startsWith(tagUrl) ? 'selected' : ''}
                                        key={tag}>
                                        <div>
                                            {i > 0 && <span className="separator">&nbsp;|&nbsp;</span>}
                                            <a className="hover" href={tagUrl}>{tag}</a >
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                    <li></li>
                    {/* <li className="header-nav--search"><a className="hover" href={url("/search.html")}>Search</a></li> */}
                </ul>

            </div>
        </div>
    );
}

