const { Command } = require('commander');

const { getCommandPaths } = require('./command-path-retriever');

const program = new Command();

program
    .name('which')
    .description('Clone of \'which\' that works on Windows and Linux. The which utility takes a list of command names and searches the path for each executable file that would be run had these commands actually been invoked. On Windows, if you do not enter the executable extension (for example, ".exe"), the code will search for the command ending with any of the executable extensions provided by the environment variable "PATHEXT" and return them all')
    .version('0.0.1');

program
    .option('-a --all', 'print all matching pathnames of each argument')

program
    .argument('<commands...>', 'list of commands which pathnames are to be returned')
    .action((inputtedCommands, options) => {
        
        const yellow = '\x1b[33m';
        const end = '\x1b[0m';

        for (const command of inputtedCommands) {

            const paths = getCommandPaths(command, options.all);

            paths.forEach((path) => {

                let output = '';

                if (path.correctedCommand) {
                    output += `${yellow}${path.correctedCommand}${end} `;
                }

                output += path.pathVariable;

                console.log(output);

            });

        }

    })

program.parse(process.argv);