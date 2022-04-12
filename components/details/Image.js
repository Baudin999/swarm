import React from "react";

export default function ({ src, alt = 'image' }) {
    return (
        <img src={src} alt={alt} />
    );
}