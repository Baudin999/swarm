import React from "react";
import ReactDOMServer from "react-dom/server";
import Page from "./../components/Page";
import Tag from "./../components/Tag";
import state from '../components/globalState';
import { distDir } from "./swarm.settings";
import path from "path";
import fs from "fs";
import prettyHtml from "html";
import Url from "../components/Url";

export default function saveHtmlTag(tag) {
    // generate the home page, index.html file
    const folderPath = `./${tag.toLowerCase()}`;
    const pagePath = `${folderPath}/index.html`;

    if (!fs.existsSync(path.join(distDir, folderPath))) {
        fs.mkdirSync(path.join(distDir, folderPath));
    }

    const pageUrl = Url(pagePath);
    state.setState('currentUrl', pageUrl);

    var html = ReactDOMServer.renderToString((
        <Page SEO={{}} baseUrl={null}>
            <Tag tag={tag} />
        </Page>)
    );
    var htmlPath = path.join(distDir, `${pagePath}`);
    fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));
}
