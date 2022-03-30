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
import _ from 'lodash';

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

    const getContentDirectories = (contentRoot) => {
        // everything is structured in teh content directory as
        // content/<github user>/<github repo>/organisation/author/blog
        // we will need to itterate the github users and the github repos
        // to get to the actual content items.
        // We also need to ignore the .git folders

        var contentDirectories = fs.readdirSync(contentRoot, { withFileTypes: true })
            .filter(githubUserDirent => githubUserDirent.isDirectory())
            .map(githubUserDirent => { // the github users
                var userPath = join(contentRoot, githubUserDirent.name);
                return fs.readdirSync(userPath, { withFileTypes: true })
                    .filter(githubRepoDirent => githubRepoDirent.isDirectory())
                    .map(githubRepoDirent => { // the github repos
                        return join(userPath, githubRepoDirent.name);
                    });
            })
            .flat(2);

        return contentDirectories;
    };

    const mergeOrg = (org1, org2) => {
        let newAuthors = org1.authors;
        if (org1.id === org2.id) {
            newAuthors = [...org1.authors, ...org2.authors];
        }
        var newOrg = {...org1, ...org2};
        newOrg.authors = newAuthors;
        return newOrg;
    }

    const getOrganisations = (contentDirs) => {

        var organisations =
            contentDirs
                .map(dir => {
                    return fs.readdirSync(dir, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .filter(dirent => dirent.name !== '.git')
                        .map(dirent => {
                            var data = queryOrganisationData(dirent, dir);
                            var authors = mapOrganisationAuthors(data.path, data.id);
                            return { ...data, authors };
                        });
                })
                .flat(1);
        
        // objects need to be merged if they start witht he same organisation
        var orgs = {};
        organisations.forEach(org => {
            if (!orgs[org.id]) {
                orgs[org.id] = org;
            }
            else {
                let merged_object = mergeOrg(orgs[org.id], org);
                console.log(merged_object);
                orgs[org.id] = merged_object;
            }
        });

        return Object
            .keys(orgs)
            .map(key => orgs[key]);

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

    // GET ALL THE DATA
    var contentDirectories = getContentDirectories(contentDir);
    var organisations = getOrganisations(contentDirectories);

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