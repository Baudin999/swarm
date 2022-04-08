import fs from 'fs';
import { join } from 'path';
import MarkdownIt from "markdown-it";
import fm from "front-matter";
import moment from "moment";
import _ from 'lodash';
import url from './../components/Url';

export function queryOrganisationData(dirent, contentRoot) {
    var orgId = _.kebabCase(dirent.name.toLowerCase());
    var orgDirPath = join(contentRoot, dirent.name);
    var orgInfoPath = join(orgDirPath, "info.json");
    var info = {};
    if (fs.existsSync(orgInfoPath)) {
        var infoText = fs.readFileSync(orgInfoPath, "utf8");
        info = JSON.parse(infoText);
    }

    var markdownPath = join(orgDirPath, "index.md");
    var html;
    if (fs.existsSync(markdownPath)) {
        var markdownText = fs.readFileSync(markdownPath, "utf8");
        var md = new MarkdownIt();
        var config = fm(markdownText);
        info = { ...info, ...config.attributes };
        html = md.render(config.body);
    }


    var organisaationResult = {
        id: orgId,
        path: orgDirPath,
        name: dirent.name,
        url: url(`/${orgId}`),
        ...info,
        SEO: info
    };
    if (html) {
        organisaationResult.html = html;
    }
    return organisaationResult;
}


export function queryAuthorData(organisationDir, dirent, orgId, orgName) {
    orgName = orgName || orgId;
    var authorDirPath = join(organisationDir, dirent.name);
    var authorInfoPath = join(authorDirPath, "info.json");
    var authorId = _.kebabCase(dirent.name.toLowerCase());
    let authorUrl = url(`/${orgId}/${authorId}/`);

    var info = {};
    if (fs.existsSync(authorInfoPath)) {
        var infoText = fs.readFileSync(authorInfoPath, "utf8");
        info = JSON.parse(infoText);
    }
    var markdownPath = join(authorDirPath, "index.md");
    var html;
    if (fs.existsSync(markdownPath)) {
        var markdownText = fs.readFileSync(markdownPath, "utf8");
        var md = new MarkdownIt();
        var config = fm(markdownText);
        info = { ...info, ...config.attributes };
        html = md.render(config.body);
    }
    if (info.image) {
        info.image = url(info.image, authorUrl);
    }

    return {
        id: authorId,
        name: dirent.name,
        org_id: orgId,
        org_name: orgName,
        ...info,
        SEO: info,
        path: authorDirPath,
        url: authorUrl,
        html
    };
}

export function queryBlogData(authorDir, author, blogName, blogUrl) {

    var blogId = _.kebabCase(blogName);
    var blogDirPath = join(authorDir, blogName);
    var markdownText = fs.readFileSync(join(blogDirPath, "index.md"), "utf8");
    var config = fm(markdownText);
    var md = new MarkdownIt();
    var html = md.render(config.body);
    config.attributes.title = config.attributes.title || blogName;
    config.attributes.tags = (config.attributes.tags || []).map(tag => tag.toLowerCase());
    config.attributes.author = config.attributes.author || author.name;
    if (!config.attributes.date) {
        config.attributes.date_real = fs.statSync(blogDirPath).ctime;
    }
    else {
        config.attributes.date_real = moment(config.attributes.date, "DD-MM-YYYY").toDate();
    }
    if (config.attributes.image) {
        config.attributes.image = url(config.attributes.image, blogUrl);
    }

    config.attributes.date = config.attributes.date_real.toDateString('nl-NL');
    return {
        id: blogId,
        path: join(authorDir, blogName),
        ...config.attributes,
        SEO: config.attributes,
        author_id: author.id,
        author_role: author.role,
        url: blogUrl,
        html
    };
}