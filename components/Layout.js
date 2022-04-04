import React from "react";
import Header from "./details/Header"

export default function Layout({ children }) {
    return (
        <div className="root">
            <Header />
            <div className="root--content">
                {children}
            </div>
        </div>
    );
}