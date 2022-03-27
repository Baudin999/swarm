import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";
import { join } from 'path';
import Welcome from "./../components/Welcome";
import MarkdownIt from "markdown-it";
import fm from "front-matter"


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
            return { id: dirent.name, path: join(authorDir, dirent.name), frontmatter: config.attributes, html };
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


var organisations = getOrganisations(contentDir);

organisations.forEach(org => {
    org.authors.forEach(author => {
        author.blogs.forEach(blog => {
            var string = ReactDOMServer.renderToString(<Welcome organisation={org} author={author} blog={blog} />);
            console.log(string);
        });
    });
});

console.log(JSON.stringify(organisations, null, 4));