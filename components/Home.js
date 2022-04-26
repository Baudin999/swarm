

import React from "react";
import stateContainer, { getRandomTile } from "./globalState";
import HomeAuthors from "./details/HomeAuthors";
import HomeBlock from "./HomeBlock";
import url from "./Url";

export default function Home({ orgs }) {
    let allBlogs = stateContainer.getState('all_blogs');
    var authors = orgs.map(org => org.authors).flat(1);

    let techlab = authors.find(author => author.name == "TechLab");
    let image;
    if (techlab) {
        image = techlab.image;
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
                            <h2 className="home--top-panel--right--footer--title">New Posts</h2>
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

                {techlab &&
                    <>
                        <div style={{ marginTop: "7rem" }} />
                        <HomeBlock
                            size="small"
                            author={"TechLab"}
                            image={image}
                            text={techlabText}
                            sideImage={randomTile.image} />
                        <div style={{ marginTop: "7rem" }} />
                    </>
                }
                {randomTile &&
                    <>
                        <h2 className="accented">Inspiration & Videos</h2>
                        <HomeBlock
                            size="large"
                            author={"TechLab"}
                            image={randomTile.image}
                            backgroundSize="contain"
                            text={techlabText}>
                            <div style={{ flex: 1, height: "100%" }}>
                                <iframe
                                    height="100%"
                                    width="100%"
                                    src="https://www.youtube.com/embed/nakYk1aGaq0"
                                    title="Hackathon behind the scenes"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen={true}></iframe>
                            </div>
                        </HomeBlock>
                    </>
                }
            </div>
        </div>
    );
}