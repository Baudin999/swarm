import React from "react";
import ReactDOMServer from "react-dom/server";
import AllBlogs from "../components/AllBlogs";
import Page from "../components/Page";
import fs from "fs";
import prettyHtml from "html";
import { join } from "path";

export default function render(distDir) {
    function renderAllBlogs() {
        var AllBlogsHtml = ReactDOMServer.renderToString((
            <Page SEO={{}}>
                <AllBlogs />
            </Page>
        ));
        var searchHtmlPath = join(distDir, "all-blogs.html");
        fs.writeFileSync(searchHtmlPath, prettyHtml.prettyPrint(AllBlogsHtml, { indent_size: 4 }));
    }
    renderAllBlogs();
}