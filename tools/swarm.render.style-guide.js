import React from "react";
import ReactDOMServer from "react-dom/server";
import StyleGuide from "../components/StyleGuide";
import fs from "fs";
import prettyHtml from "html";
import { join } from "path";

export default function render(distDir) {
    function renderStyleGuide() {
        var styleguideHtml = ReactDOMServer.renderToString((
            <StyleGuide />
        ));
        var styleguideHtmlPath = join(distDir, "styleguide.html");
        fs.writeFileSync(styleguideHtmlPath, prettyHtml.prettyPrint(styleguideHtml, { indent_size: 4 }));
    }
    renderStyleGuide();
}