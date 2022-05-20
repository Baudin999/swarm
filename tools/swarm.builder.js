import fs from "fs";
import { join } from 'path';
import _ from 'lodash';
import { queryOrganisationData, queryAuthorData, queryBlogData, queryAgendaData } from "./swarm.queries";
import { getAllTags, setGlobalState, setTiles, setAgenda } from "./swarm.render.global-state";
import saveHtml from './swarm.saveHtml';
import { rootDir, distDir, distPublicDir, distPreviewDir, contentDir, getSettings } from './swarm.settings';
import url from './../components/Url';


function run() {

    let tiles = [];
    let agendaItems = [];

    // QUERIES

    const mapTiles = (fullName, dirName, orgId) => {
        let files = fs.readdirSync(fullName);
        files.forEach(file => {
            let result = {
                url: url(`/${orgId}/tiles/${file}`),
                name: file.split('.')[0],
                image: url(`/${orgId}/tiles/${file}`),
            };
            tiles.push(result);
        });
    };

    const mapAgendaItems = (fullName, dirName, orgId) => {
        let files = fs.readdirSync(fullName);
        files.forEach(file => {
            let data = queryAgendaData(join(fullName, file));
            let result = {
                url: url(`/${orgId}/agenda/${file}`),
                ...data
            };
            agendaItems.push(result);
        });
    }

    const mapAuthorBlogs = (authorDir, author, orgId) => {
        let blogs = fs.readdirSync(authorDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                let blogUrl = url(`/${orgId}/${author.id}/${dirent.name}/`);
                return queryBlogData(authorDir, author, dirent.name, blogUrl);
            });
        return blogs.filter(b => b && b.publish === true);
    };

    const mapOrganisationAuthors = (organisationDir, orgId, orgName) => {
        return fs.readdirSync(organisationDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                if (dirent.name !== "tiles" && dirent.name !== "agenda") {
                    var data = queryAuthorData(organisationDir, dirent, orgId);
                    var blogs = mapAuthorBlogs(data.path, data, orgId);
                    return { ...data, blogs };
                }
                else if (dirent.name === "agenda") {
                    mapAgendaItems(join(organisationDir, dirent.name), dirent.name, orgId);
                }
                else if (dirent.name === "tiles") {
                    mapTiles(join(organisationDir, dirent.name), dirent.name, orgId);
                }
            });
    };

    const parseContentDirectories = (contentRoot) => {
        // everything is structured in the content directory as
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
        var newOrg = { ...org1, ...org2 };
        newOrg.authors = newAuthors;
        return newOrg;
    };

    const getOrganisations = (contentDirs) => {

        var organisations =
            contentDirs
                .map(dir => {
                    return fs.readdirSync(dir, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .filter(dirent => dirent.name !== '.git')
                        .map(dirent => {
                            var data = queryOrganisationData(dirent, dir);
                            var authors = mapOrganisationAuthors(data.path, data.id, data.name).filter(m => m !== undefined && m !== null);
                            return { ...data, authors };
                        });
                })
                .flat(1);

        // objects need to be merged if they start with the same organisation
        var orgs = {};
        organisations.forEach(org => {
            if (!orgs[org.id]) {
                orgs[org.id] = org;
            }
            else {
                let merged_object = mergeOrg(orgs[org.id], org);
                orgs[org.id] = merged_object;
            }
        });

        return Object
            .keys(orgs)
            .map(key => orgs[key]);

    };




    // GET ALL THE DATA
    var contentDirectories = parseContentDirectories(contentDir);
    var organisations = getOrganisations(contentDirectories);

    // SET GLOBAL DATA
    setGlobalState(organisations);
    setTiles(tiles);
    setAgenda(agendaItems);

    console.log(agendaItems);

    saveHtml(distDir, null, organisations, contentDirectories);
}
export default run;