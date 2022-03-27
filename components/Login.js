

import React from "react";

export default function Login({clientId}) {
    return (
        <div>
            <a href={`https://github.com/login/oauth/authorize?clientId=${clientId}&redirect_uri=http://localhost:3000/return`}>LOGIN WITH GITHUB</a>
        </div>
    );
}