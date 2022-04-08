import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from 'fs';
import { join } from 'path';
import fsExtra from 'fs-extra';
import Page from "./../components/Page";
import Author from "../components/Author";
import Organisation from "../components/Organisation";
import Blog from "../components/Blog";
import Home from "../components/Home";
import _ from 'lodash';

import prettyHtml from "html";
import renderLogin from "./swarm.render.login";
import renderStyleGuide from "./swarm.render.style-guide";
import renderSearch from "./swarm.render.search";
import renderAllBlogs from "./swarm.render.all-blogs";
import saveHtmlTag from "./swarm.saveHtml.tag";
import state from '../components/globalState';
import { getAllTags } from "./swarm.render.global-state";

function saveHtml(distDir, baseUrl = '/', organisations, contentDirectories) {
    // SAVE HTML FILES
    const saveIndexAndCopyDirectory = (html, fromDir, toDir) => {
        if (!fs.existsSync(toDir)) {
            fsExtra.mkdirpSync(toDir);
        }
        fs.writeFileSync(join(toDir, "index.html"), prettyHtml.prettyPrint(html, { indent_size: 4 }));
        fsExtra.copySync(fromDir, toDir);
    };

    const saveBlogHtml = (html, distRootPath, blog, author, org) => {
        var fromDir = blog.path;
        var toDir = join(distRootPath, org.id, author.id, blog.id);
        saveIndexAndCopyDirectory(html, fromDir, toDir);
    };

    const saveAuthorHtml = (html, distRootPath, author, org) => {
        var fromDir = author.path;
        var toDir = join(distRootPath, org.id, author.id);
        saveIndexAndCopyDirectory(html, fromDir, toDir);
    };

    const saveOrganisationHtml = (html, distRootPath, org) => {
        var fromDir = org.path;
        var toDir = join(distRootPath, org.id);
        saveIndexAndCopyDirectory(html, fromDir, toDir);
    };

    const saveHomeHtml = (html, distRootPath) => {
        var htmlPath = join(distRootPath, "index.html");
        fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));

        // write the random images and other files to the root of the dist.
        contentDirectories.forEach(contentDir => {
            fs.readdirSync(contentDir, { withFileTypes: true })
                .filter(dirent => !dirent.isDirectory())
                .forEach(dirent => {
                    let from = join(contentDir, dirent.name);
                    let to = join(distRootPath, dirent.name);
                    fs.copyFileSync(from, to);
                });

        });
    };

    // CREATE ALL OF THE STATIC HTML PAGES
    organisations.forEach(org => {
        org.authors.forEach(author => {
            author.blogs.forEach(blog => {

                // RENDER ALL BLOGS
                state.setState('currentUrl', blog.url);
                var string = ReactDOMServer.renderToString((
                    <Page SEO={blog.SEO} url={blog.url} baseUrl={baseUrl}>
                        <Blog organisation={org} author={author} blog={blog} />
                    </Page>)
                );
                saveBlogHtml(string, distDir, blog, author, org);
            });

            // RENDER ALL AUTHORS
            state.setState('currentUrl', author.url);
            var authorString = ReactDOMServer.renderToString((
                <Page SEO={author.SEO} baseUrl={baseUrl}>
                    <Author organisation={org} author={author} />
                </Page>)
            );
            saveAuthorHtml(authorString, distDir, author, org);
        });

        // RENDER ALL ORGANISATIONS
        state.setState('currentUrl', org.url);
        var orgHtml = ReactDOMServer.renderToString((
            <Page SEO={org.SEO} baseUrl={baseUrl}>
                <Organisation organisation={org} />
            </Page>)
        );
        saveOrganisationHtml(orgHtml, distDir, org);
    });

    // generate the home page, index.html file
    state.setState('currentUrl', '/');
    var homeHtml = ReactDOMServer.renderToString((
        <Page SEO={{}} baseUrl={baseUrl}>
            <Home orgs={organisations} />
        </Page>)
    );
    saveHomeHtml(homeHtml, distDir);

    // THE APP.CONFIG FILE CONTAINS LOGIN INFORMATION FOR GITHUB
    state.setState('currentUrl', '/login');
    renderLogin(distDir, baseUrl);

    // RENDER STYLEGUIDE
    state.setState('currentUrl', '/styleguide');
    renderStyleGuide(distDir, baseUrl);

    // RENDER SEARCH
    state.setState('currentUrl', '/search');
    renderSearch(distDir, baseUrl);

    // RENDER ALL BLOGS
    state.setState('currentUrl', '/all-blogs.html');
    renderAllBlogs(distDir, baseUrl);

    let tags = getAllTags();
    tags.forEach(tag => {
        state.setState('currentUrl', '/');
        saveHtmlTag(tag);
    });
    state.setState('currentUrl', '/');
}

export default saveHtml;