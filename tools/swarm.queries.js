import fs from 'fs';
import { join } from 'path';
import MarkdownIt from "markdown-it";
import fm from "front-matter";
import moment from "moment";
import { kebabCase } from 'lodash';
import url from './../components/Url';

const md = new MarkdownIt()
    .use(require('markdown-it-highlightjs'), {})
    .use(require('markdown-it-katex'));

export function queryOrganisationData(dirent, contentRoot) {
    let orgId = kebabCase(dirent.name.toLowerCase());
    let orgDirPath = join(contentRoot, dirent.name);
    let orgInfoPath = join(orgDirPath, "info.json");
    let info = {};
    if (fs.existsSync(orgInfoPath)) {
        let infoText = fs.readFileSync(orgInfoPath, "utf8");
        info = JSON.parse(infoText);
    }

    let markdownPath = join(orgDirPath, "index.md");
    let html;
    if (fs.existsSync(markdownPath)) {
        let markdownText = fs.readFileSync(markdownPath, "utf8");
        let config = fm(markdownText);
        info = { ...info, ...config.attributes };
        html = md.render(config.body);
    }


    let organisaationResult = {
        id: orgId,
        path: orgDirPath,
        name: dirent.name,
        url: url(`/${orgId}/`),
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
    let authorDirPath = join(organisationDir, dirent.name);
    let authorInfoPath = join(authorDirPath, "info.json");
    let authorId = kebabCase(dirent.name.toLowerCase());
    let authorUrl = url(`/${orgId}/${authorId}/`);

    let info = {};
    if (fs.existsSync(authorInfoPath)) {
        let infoText = fs.readFileSync(authorInfoPath, "utf8");
        info = JSON.parse(infoText);
    }
    let markdownPath = join(authorDirPath, "index.md");
    let html;
    if (fs.existsSync(markdownPath)) {
        let markdownText = fs.readFileSync(markdownPath, "utf8");
        let config = fm(markdownText);
        config.attributes.title = config.attributes.title || config.attributes.name || "author@essent.nl";
        config.attributes.description = config.attributes.description || "author@essent.nl";
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

    let blogId = kebabCase(blogName);
    let blogDirPath = join(authorDir, blogName);
    let markdownText = fs.readFileSync(join(blogDirPath, "index.md"), "utf8");
    let config = fm(markdownText);

    let html = md.render(config.body);
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

    if (config.attributes.publish === undefined) {
        config.attributes.publish = true;
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


export const queryAgendaData = (fileName) => {
    // Query the data of the agenda item
    let data = {};
    if (fs.existsSync(fileName)) {
        let markdownText = fs.readFileSync(fileName, "utf8");
        let config = fm(markdownText);
        if (config.attributes.date) {
            config.attributes.date_real = moment(config.attributes.date, "DD-MM-YYYY").toDate();
        }
        data = { ...config.attributes, SEO: config.attributes };
        let html = md.render(config.body);

        return {
            ...data,
            html
        };
    }

    return {};
}