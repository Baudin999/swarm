import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";
import { join } from 'path';
import fsExtra from "fs-extra";
import Page from "./../components/Page";
import Author from "../components/Author";
import Organisation from "../components/Organisation";
import Blog from "../components/Blog";
import Home from "../components/Home";

import prettyHtml from "html";
import renderLogin from "./index.renderLogin";
import renderStyleGuide from "./index.renderStyleGuide";
import { queryOrganisationData, queryAuthorData, queryBlogData } from "./index.queries";
import { setGlobalState } from "./index.globalState";

function run() {
    // some setup to get to the root of the project
    const __dirname = process.cwd();
    const rootDir = __dirname; //join(__dirname, '..');
    const contentDir = join(rootDir, 'content');
    const distDir = join(rootDir, 'dist');


    // QUERIES
    const mapAuthorBlogs = (authorDir, orgId, authorId) => {
        return fs.readdirSync(authorDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                let url = `/${orgId}/${authorId}/${dirent.name}/`;
                return queryBlogData(authorDir, dirent.name, url);
            });
    };

    const mapOrganisationAuthors = (organisationDir, orgId) => {
        return fs.readdirSync(organisationDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                var data = queryAuthorData(organisationDir, dirent, orgId);
                var blogs = mapAuthorBlogs(data.path, orgId, data.id);
                return { ...data, blogs };
            });
    };

    const getOrganisations = (contentRoot) => {
        var organisations =
            fs.readdirSync(contentRoot, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => {
                    var data = queryOrganisationData(dirent, contentRoot);
                    var authors = mapOrganisationAuthors(data.path, data.id);
                    return { ...data, authors };
                });

        return organisations;
    };


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
        fsExtra.copySync(contentDir, distRootPath);
    };

    // GET ALL THE DATA
    var organisations = getOrganisations(contentDir);

    // SET GLOBAL DATA
    setGlobalState(organisations);


    // CREATE ALL OF THE STATIC HTML PAGES
    organisations.forEach(org => {
        org.authors.forEach(author => {
            author.blogs.forEach(blog => {

                // RENDER ALL BLOGS
                var string = ReactDOMServer.renderToString((
                    <Page SEO={blog.SEO}>
                        <Blog organisation={org} author={author} blog={blog} />
                    </Page>)
                );

                saveBlogHtml(string, distDir, blog, author, org);
            });

            // RENDER ALL AUTHORS
            var authorString = ReactDOMServer.renderToString((
                <Page SEO={author.SEO}>
                    <Author organisation={org} author={author} />
                </Page>)
            );
            saveAuthorHtml(authorString, distDir, author, org);
        });

        // RENDER ALL ORGANISATIONS
        var orgHtml = ReactDOMServer.renderToString((
            <Page SEO={org.SEO}>
                <Organisation organisation={org} />
            </Page>)
        );
        saveOrganisationHtml(orgHtml, distDir, org);
    });

    // generate the home page, index.html file
    var homeHtml = ReactDOMServer.renderToString((
        <Page SEO={{}}>
            <Home orgs={organisations} />
        </Page>)
    );
    saveHomeHtml(homeHtml, distDir);

    // THE APP.CONFIG FILE CONTAINS LOGIN INFORMATION FOR GITHUB
    renderLogin(distDir);

    // RENDER STYLEGUIDE
    renderStyleGuide(distDir);

}
export default run;