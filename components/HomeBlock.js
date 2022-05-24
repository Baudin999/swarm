import React from "react";
import stateContainer from "./globalState";

export default function HomeBlock({
    size = "small",
    author,
    image,
    text,
    sideImage,
    backgroundSize = 'cover',
    children }) {

    let style = "";
    if (image) {
        style = {
            backgroundImage: `url(${image})`,
            backgroundSize: backgroundSize,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        };
    }

    return (
        <div className={`home-content-block ${size}`} >
            <div className="home-content-block--left" style={style}>
                {/*This is the image of the author*/}
            </div>

            <div className="home-content-block--right">
                {author && !children && <h2 className="title" style={{color: "white!important"}}>{author}</h2>}
                {children && children}
                {text && !children && <p>{text}</p>}
            </div>
        </div>
    );
};