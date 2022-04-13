

/*
This is the CLI tool for the swarm application. With this tool we can execute commands
instead of having to run npm scripts to work with swarm.
*/
import path from 'path';
import fsExtra from 'fs-extra';
import { program } from 'commander';
import cmd from 'node-cmd';
import { listSources, getSwarmConfig, saveSwarmConfig } from './commands/list.js';
import getContentFromRepos from '../tools/swarm.content.pull.js';
import server from './../tools/server';
import build from './../tools/swarm.builder';
import push from './../tools/swarm.content.push';
import styles from './../dist/styles.css';
import { configName } from './../tools/swarm.settings.js';

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

const checker = program
    .command('check')
    .description("Check the pre-requisites of the swarm application.")
    .action(() => {
        cmd.run('git --version', (err, data, stderr) => {
            if (err) console.log("git is not installed. Please install git.");
            else {
                console.log("Git is installed.");
                cmd.run('git status', (err, data, stderr) => {
                    if (err) console.log("git is not configured. Please configure and initialize git.");
                    else {
                        console.log("git is configured.");
                    }
                });
            }
        });

        cmd.run('swa --version', (err, data, stderr) => {
            if (err) console.log("swa is not installed. Please install swa. (Azure static web apps cli)");
            else console.log("Static Web Apps is installed.");
        });
    });

const commit = program
    .command('commit')
    .argument('<message>', "the commit message")
    .description("Commit the changes to the swarm application.")
    .action((message) => {
        cmd.run('git add .', (err, data, stderr) => {
            if (err) console.log("Error while adding files to git.");
            else {
                // let { message } = props;
                let command = `git commit -m "${message}"`;
                cmd.run(command, (err, data, stderr) => {

                    if (err) {
                        if (data.indexOf("nothing to commit") > -1) {
                            console.log("No changes to commit.");
                        }
                        else if (data) {
                            console.log(data);
                        }
                        else {
                            console.log("Error while commiting files to git.");
                        }
                    }
                    else {
                        console.log("Commited files to git.");
                        cmd.run('git push origin master', (err, data, stderr) => {
                            if (err) console.log("Error while pushing files to git.");
                            else {
                                console.log("Pushed files to git.");
                            }
                        });
                    }
                });
            }
        });
    });

const swa = program
    .command('swa')
    .description("Build the swarm application.")
    .action(() => {
        let processRef = cmd.run('swa start ./dist --api-location api', (err, data, stderr) => {
            if (!err) {
                console.log("started the local swa server.");
                console.log(data);
            }
        });
        let data_line = '';
        processRef.stdout.on(
            'data',
            function (data) {
                data_line += data;
                if (data_line[data_line.length - 1] == '\n') {
                    console.log(data_line);
                }
            }
        );

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
    .command('push')
    .description('Push the content to a GitHub repository which is specified in the swarm.config.json file.')
    .action(() => {
        push();
    });
content
    .command('build')
    .option('-p --production', 'Build for production')
    .option('-d --dev', 'Build for development')
    .option('-k --key <key>', 'The key in the swarm.config.json file to use for the build.')
    .action(options => {

        let { key, production, dev } = options;

        if (production) {
            global.isProduction = true;
        }
        else if (dev) {
            global.isDev = true;
        }

        if (key) {
            global.configKey = key;
        }

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
        console.log(`Created the '${configName}' containing:`);
        console.log(JSON.stringify(config, null, 4));
    });

program
    .command('serve')
    .action(() => {
        server(currentDir);
    });

program
    .command('reset')
    .description('Reset the swarm application, delete everything in the directory.')
    .action(() => {
        fsExtra.remove(currentDir, (e) => {
            if (e) {
                console.log(e);
            }
            else {
                console.log("Reset the swarm directory complete.");
            }
        });
    });

program.parse();