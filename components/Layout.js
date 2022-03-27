import React from "react";
import Header from "./details/Header"

export default function Layout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}