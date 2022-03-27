import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";
import { join } from 'path';
import fsExtra from "fs-extra";
import Page from "./../components/Page";
import Welcome from "./../components/Welcome";
import MarkdownIt from "markdown-it";
import fm from "front-matter";
import prettyHtml from "html";


// some setup to get to the root of the project
const __dirname = process.cwd();
const rootDir = __dirname; //join(__dirname, '..');
const contentDir = join(rootDir, 'content');
const distDir = join(rootDir, 'dist');

const mapAuthorBlogs = (authorDir) => {
    return fs.readdirSync(authorDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            var blogDirPath = join(authorDir, dirent.name);
            var markdownText = fs.readFileSync(join(blogDirPath, "index.md"), "utf8");
            var md = new MarkdownIt();
            var config = fm(markdownText);
            var html = md.render(config.body);
            var title = config.attributes.title | dirent.name;
            return { id: dirent.name, path: join(authorDir, dirent.name), title, ...config.attributes, SEO: config.attributes, html };
        });
};


const mapOrganisationAuthors = (organisationDir) => {
    return fs.readdirSync(organisationDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            var authorDirPath = join(organisationDir, dirent.name);
            var authorInfoPath = join(authorDirPath, "info.json");
            var info = {};
            if (fs.existsSync(authorInfoPath)) {
                var infoText = fs.readFileSync(authorInfoPath, "utf8");
                info = JSON.parse(infoText);
            }
            var blogs = mapAuthorBlogs(authorDirPath);
            return { id: dirent.name, name: dirent.name, ...info, path: authorDirPath, blogs };
        });
};

const getOrganisations = (contentRoot) => {
    var organisations =
        fs.readdirSync(contentRoot, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                var orgDirPath = join(contentRoot, dirent.name);
                var orgInfoPath = join(orgDirPath, "info.json");
                var info = {};
                if (fs.existsSync(orgInfoPath)) {
                    var infoText = fs.readFileSync(orgInfoPath, "utf8");
                    info = JSON.parse(infoText);
                }
                var authors = mapOrganisationAuthors(orgDirPath);
                return { id: dirent.name, name: dirent.name, ...info, authors };
            });

    return organisations;
};

const saveHtml = (html, distRootPath, blog, author, org) => {
    var htmlPath = join(distRootPath, org.id, author.id, blog.id, "index.html");
    var dirName = join(distRootPath, org.id, author.id, blog.id);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
    fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));
    fs.writeFileSync(join(dirName, "index.json"), JSON.stringify(blog, null, 4));
    fsExtra.copySync(blog.path, dirName);
};


var organisations = getOrganisations(contentDir);

organisations.forEach(org => {
    org.authors.forEach(author => {
        author.blogs.forEach(blog => {
            var string = ReactDOMServer.renderToString((
                <Page SEO={blog.SEO}>
                    <Welcome organisation={org} author={author} blog={blog} />
                </Page>)
            );

            saveHtml(string, distDir, blog, author, org);
        });
    });
});

