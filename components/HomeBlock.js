import React from "react";
import stateContainer from "./globalState";

export default function HomeBlock({ size = "small", author, image, text, sideImage }) {

    let style = "";
    if (image) {
        style = {
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };
    }

    let sideStyle = "";
    if (sideImage) {
        sideStyle = {
            backgroundImage: `url(${sideImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        };
    }

    return (
        <div className={`home-content-block ${size}`} >
            <div className="home-content-block--left" style={style}>
                <div className="home-content-block--left--footer">
                    <h2>{author}</h2>
                    <div className="home-content-block--left--content">
                        {text}
                    </div>
                </div>
            </div>
            <div className="home-content-block--right" style={sideStyle}>
            </div>
        </div>
    );
};