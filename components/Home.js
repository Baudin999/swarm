

import React from "react";
import stateContainer, { getRandomTile } from "./globalState";
import HomeAuthors from "./details/HomeAuthors";
import HomeBlock from "./HomeBlock";
import url from "./Url";
import { getSettings } from "../tools/swarm.settings";

export default function Home({ orgs }) {
    let settings = getSettings();
    let allBlogs = stateContainer.getState('all_blogs');
    let authors = orgs.map(org => org.authors).flat(1);


    let highlighted, image;
    if (settings.highlight) {
        highlighted = authors.find(author => author.name == settings.highlight);
        if (highlighted) {
            image = highlighted.image;
        }
    }
    let randomTile = getRandomTile();

    let [first, ...rest] = allBlogs;
    let topFour = rest.slice(0, 4);

    let firstUrl = first.image || ('./home-01.jpeg');

    let leftStyles = {
        backgroundImage: `url(${firstUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };

    let techlabText = "TechLab is a group of enthusiastic Essent IT colleagues that gather every Friday and work on proof of concepts. Interested? Follow them on this site every Friday.";

    return (
        <div className="home-container">
            <div className="home">
                <div className="home--top-panel">
                    <div className="home--top-panel--left" style={leftStyles}>
                        <div className="home--top-panel--left--footer">
                            <a href={first.url}>
                                <div className="home--top-panel--left--footer--title"><h2>{first.title}</h2></div>
                                <div className="home--top-panel--left--footer--author">{first.author_name} | {first.author_role}</div>
                            </a>
                        </div>
                    </div>
                    <div className="home--top-panel--right">
                        <div className="home--top-panel--right--footer">
                            <h2 className="title home--top-panel--right--footer--title">New Articles</h2>
                            <ul className="home--top-panel--right--footer--posts">
                                {topFour.map(blog => (
                                    <li key={blog.id}>
                                        <a href={blog.url}>{blog.author_name} - {blog.title}</a>
                                    </li>
                                ))}
                            </ul>
                            <a href={url("/all-blogs.html")}>Read all publications</a>
                        </div>
                    </div>
                </div>

                <HomeAuthors />

                {highlighted &&
                    <>
                        <div style={{ marginTop: "7rem" }} />
                        <HomeBlock
                            size="small"
                            image={image}
                            sideImage={randomTile.image}>
                                <div>
                                    <h2>{highlighted.name}</h2>
                                    <div dangerouslySetInnerHTML={{__html: highlighted.html}}></div>
                                </div>
                            </HomeBlock>
                        <div style={{ marginTop: "7rem" }} />
                    </>
                }
                {randomTile &&
                    <>
                        <h2 className="title" style={{marginTop: "5rem"}}>Inspiration & Videos</h2>
                        <HomeBlock
                            size="large"
                            author={"TechLab"}
                            image={randomTile.image}
                            backgroundSize="contain"
                            text={techlabText}>
                            <div style={{ flex: 1, height: "100%" }}>
                                <a style={{ height: "100%", width: "100%" }} href={"https://www.youtube.com/watch?v=nakYk1aGaq0"} target={"_blank"}>
                                    <img src={"youtube-cover.png"} />
                                </a>
                            </div>
                        </HomeBlock>
                    </>
                }
            </div>
        </div>
    );
}