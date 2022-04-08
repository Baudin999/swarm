import React from "react";
import stateContainer from "../globalState";


export default function HomeAuthors() {
    var authors = stateContainer.getState('authors') || [];

    return (
        <div className="home--authors">
            <h1>Meet our contributers</h1>

            <div className="home--authors--container">
                {authors.map(author => {
                    return (
                        <a href={author.url} key={author.id} className="home--authors--container--author">
                            {/* <div > */}
                            <div className="home--authors--container--author--image">
                                <img src={author.image} />
                            </div>
                            <div className="home--authors--container--author--name">
                                {author.name}
                            </div>
                            <div className="home--authors--container--author--role">
                                {author.role}
                            </div>
                            <div className="home--authors--container--author--contributions">
                                <div>{author.blogs.length} contributions</div>
                            </div>
                            {/* </div> */}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

