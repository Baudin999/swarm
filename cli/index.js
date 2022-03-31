

/*
This is the CLI tool for the swarm application. With this tool we can execute commands
instead of having to run npm scripts to work with swarm.
*/
import path from 'path';
import fsExtra from 'fs-extra';
import { program } from 'commander';
import { listSources, getSwarmConfig, saveSwarmConfig } from './commands/list.js';
import getContentFromRepos from './../tools/importContent.js';
import server from './../tools/server';
import build from './../tools/index.start';
import styles from './../dist/styles.css';


const currentDir = process.cwd() || __dirname;

const sources = program
    .command('sources')
    .option('-p --path <path>')
    .description("Interact with the sources fo rthe swarm application.")
    .action(({ path }) => {
        listSources(path || currentDir);
    });
sources
    .command('add <github_link>')
    .description("Add a git link to the sources")
    .action((github_link) => {
        var config = getSwarmConfig(currentDir);
        if (config.sources.indexOf(github_link) === -1) {
            config.sources.push(github_link);
            saveSwarmConfig(currentDir, config);
            console.log("Added source: " + github_link);
        }
        else {
            console.log("Source already exists.");
        }
    });
sources
    .command('remove <github_link>')
    .description("Remove a git link to the sources")
    .action((github_link) => {
        var config = getSwarmConfig(currentDir);
        var index = config.sources.indexOf(github_link);
        if (index > -1) {
            config.sources.splice(index, 1);
            saveSwarmConfig(currentDir, config);
            console.log("Removed source: " + github_link);
        }
        else {
            console.log("Source does not exist");
        }
    });

const content = program
    .command('content')
    .description('Content commands');
content
    .command('clean')
    .action(() => {
        var contentPath = path.join(currentDir, 'content');
        fsExtra.remove(contentPath);
    });
content
    .command('pull')
    .action(() => {
        getContentFromRepos(currentDir);
    });
content
    .command('build')
    .action(() => {
        build();
        var stylesPath = path.join(currentDir, 'dist', 'styles.css');
        fsExtra.writeFileSync(stylesPath, styles);
    });

program
    .command('init')
    .action(() => {
        var config = {
            sources: [
                "https://github.com/Baudin999/swarm-content.git",
                "https://github.com/Baudin999/swarm-sample-content.git"
            ]
        };
        saveSwarmConfig(currentDir, config);
        console.log();
        console.log("Created the `app.config.json` containing:");
        console.log(JSON.stringify(config, null, 4));
    });

program
    .command('serve')
    .action(() => {
        server(currentDir);
    });

program.parse();