const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports.getCommandPaths = (command, options) => {

    let systemEnvironmentPaths = [];
    const outputPaths = [];
    const windowsExecutableExtensions = process.env.PATHEXT?.split(';').map((item) => item.toLowerCase());

    if (os.type() === 'Windows_NT') {

        systemEnvironmentPaths = process.env.Path?.split(';');

    } else if (os.type() === 'Linux') {

        systemEnvironmentPaths = process.env.PATH?.split(':');

    }

    for (const pathVariable of systemEnvironmentPaths) {

        const commandPath = path.join(pathVariable, command);

        if (isFile(commandPath)) {

            if (isExecutable(commandPath, command, windowsExecutableExtensions)) {

                outputPaths.push({ pathVariable });

            } 
            
        } else if (os.type() === 'Windows_NT' && path.extname(command) === '') {

            // In Windows, we expect that the user might not know the exact extension, so we find all possible executable extensions and return them
            for (const extension of windowsExecutableExtensions) {

                if (isFile(commandPath + extension)) {

                    outputPaths.push({ correctedCommand: command + extension, pathVariable });

                }

            }

        }

        if (!options.showAllPaths && outputPaths.length) {

            return outputPaths;

        }

    }

    return outputPaths;

}

const isFile = (commandPath) => {

    try {

        const stat = fs.statSync(commandPath);
        return stat.isFile();

    } catch (error) {

        if (error.code !== 'ENOENT') console.error(error);

    }

    return false;

}

const isExecutable = async (commandPath, command, windowsExecutableExtensions) => {

    if (os.type() === 'Windows_NT') {

        if (windowsExecutableExtensions.includes(path.extname(command))) {
            
            return true;

        }

        return false;

    }

    if (os.type() === 'Linux') {
        
        return fs.accessSync(commandPath, fs.constants.X_OK, (error) => !error);

    }

}