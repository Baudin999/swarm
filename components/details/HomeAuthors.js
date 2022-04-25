import React from "react";
import stateContainer from "../globalState";
import Image from "./Image";

export default function HomeAuthors() {
    var authors = stateContainer.getState('authors') || [];
    var topThreeAuthors = authors.slice(0, 3);

    return (
        <div className="home--authors">
            <h1>Our authors</h1>

            <div className="home--authors--container">
                {topThreeAuthors.map(author => {
                    return (
                        <a href={author.url} key={author.id} className="home--authors--container--author">
                            <div className="home--authors--container--author--image">
                                <Image src={author.image} />
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
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

