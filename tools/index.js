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
            return { id: dirent.name.toLowerCase(), path: join(authorDir, dirent.name), title, ...config.attributes, SEO: config.attributes, html };
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
            return { id: dirent.name.toLowerCase(), name: dirent.name, ...info, SEO: info, path: authorDirPath, blogs };
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
                return { id: dirent.name.toLowerCase(), path: orgDirPath, name: dirent.name, ...info, SEO: info, authors };
            });

    return organisations;
};

const saveBlogHtml = (html, distRootPath, blog, author, org) => {
    var htmlPath = join(distRootPath, org.id, author.id, blog.id, "index.html");
    var dirName = join(distRootPath, org.id, author.id, blog.id);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
    fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));
    fs.writeFileSync(join(dirName, "index.json"), JSON.stringify(blog, null, 4));
    fsExtra.copySync(blog.path, dirName);
};

const saveAuthorHtml = (html, distRootPath, author, org) => {
    var htmlPath = join(distRootPath, org.id, author.id, "index.html");
    var dirName = join(distRootPath, org.id, author.id);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
    fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));
    fs.writeFileSync(join(dirName, "index.json"), JSON.stringify(author, null, 4));
    fsExtra.copySync(author.path, dirName);
};

const saveOrganisationHtml = (html, distRootPath, org) => {
    var htmlPath = join(distRootPath, org.id, "index.html");
    var dirName = join(distRootPath, org.id);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));
    fs.writeFileSync(join(dirName, "index.json"), JSON.stringify(org, null, 4));
    fsExtra.copySync(org.path, dirName);
};

const saveHomeHtml = (html, distRootPath) => {
    var htmlPath = join(distRootPath, "index.html");
    fs.writeFileSync(htmlPath, prettyHtml.prettyPrint(html, { indent_size: 4 }));
};

var organisations = getOrganisations(contentDir);

organisations.forEach(org => {
    org.authors.forEach(author => {
        author.blogs.forEach(blog => {
            var string = ReactDOMServer.renderToString((
                <Page SEO={blog.SEO}>
                    <Blog organisation={org} author={author} blog={blog} />
                </Page>)
            );

            saveBlogHtml(string, distDir, blog, author, org);
        });


        var authorString = ReactDOMServer.renderToString((
            <Page SEO={author.SEO}>
                <Author organisation={org} author={author} />
            </Page>)
        );
        saveAuthorHtml(authorString, distDir, author, org);
    });

    var orgHtml = ReactDOMServer.renderToString((
        <Page SEO={org.SEO}>
            <Organisation organisation={org} />
        </Page>)
    );
    saveOrganisationHtml(orgHtml, distDir, org);
});

// generate the index.html file


var homeHtml = ReactDOMServer.renderToString((
    <Page SEO={{}}>
        <Home orgs={organisations} />
    </Page>)
);
saveHomeHtml(homeHtml, distDir);
