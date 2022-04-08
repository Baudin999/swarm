import React from "react";
import ReactDOMServer from "react-dom/server";
import Page from "./../components/Page";
import Tag from "./../components/Tag";
import state from '../components/globalState';
import { distDir } from "./swarm.settings";
import path from "path";
import fs from "fs";
import prettyHtml from "html";

export default function saveHtmlTag(tag) {
    // generate the home page, index.html file
    state.setState('currentUrl', '/' + tag + '.html');
    var html = ReactDOMServer.renderToString((
        <Page SEO={{}} baseUrl={null}>
            <Tag tag={tag} />
        </Page>)
    );
    var htmlPath = path.join(distDir, tag + ".html");
    fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));
}
