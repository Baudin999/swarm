import React from "react";
import ReactDOMServer from "react-dom/server";
import Search from "../components/Search";
import fs from "fs";
import prettyHtml from "html";
import { join } from "path";

export default function render(distDir) {
    function renderSearch() {
        var SearchHtml = ReactDOMServer.renderToString((
            <Search />
        ));
        SearchHtml = '<!DOCTYPE html>' + SearchHtml;
        var searchHtmlPath = join(distDir, "search.html");
        fs.writeFileSync(searchHtmlPath, prettyHtml.prettyPrint(SearchHtml, { indent_size: 4 }));
    }
    renderSearch();
}