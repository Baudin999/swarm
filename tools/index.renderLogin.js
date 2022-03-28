import React from "react";
import ReactDOMServer from "react-dom/server";
import Login from "../components/Login";
import { join } from "path";
import fs from "fs";
import prettyHtml from "html";

export default function render(distDir) {
    var config = require("./../app.config.json");

    function renderLogin(cnf) {
        var loginHtml = ReactDOMServer.renderToString((
            <Login clientId={cnf.clientId} />
        ));
        var loginHtmlPath = join(distDir, "login.html");
        fs.writeFileSync(loginHtmlPath, prettyHtml.prettyPrint(loginHtml, { indent_size: 4 }));
    }

    renderLogin(config);
}