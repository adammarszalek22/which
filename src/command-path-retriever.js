const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports.getCommandPaths = (command, showAllPaths, env = process.env) => {

    const { systemEnvironmentPaths, windowsExecutableExtensions } = getEnvironmentVariables(env);
    const outputPaths = [];

    for (const pathVariable of systemEnvironmentPaths) {

        const commandPath = path.join(pathVariable, command);

        if (isFile(commandPath) && isExecutable(commandPath, command, windowsExecutableExtensions)) {
            
            outputPaths.push({ pathVariable });

        } else if (os.type() === 'Windows_NT' && path.extname(command) === '') {

            // In Windows, we expect that the user might not know the exact extension, so we find all possible executable extensions and return them. We take the advantage of Windows PATHEXT variable
            for (const extension of windowsExecutableExtensions) {

                if (isFile(commandPath + extension)) {

                    outputPaths.push({ correctedCommand: command + extension, pathVariable });

                }

            }

        }

        if (!showAllPaths && outputPaths.length) {

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

const isExecutable = (commandPath, command, windowsExecutableExtensions) => {

    if (os.type() === 'Windows_NT') {

        if (windowsExecutableExtensions.includes(path.extname(command))) {
            
            return true;

        }

        return false;

    }

    if (os.type() === 'Linux') {

        try {

            fs.accessSync(commandPath, fs.constants.X_OK);
            return true;

        } catch (error) {

            return false;

        }

    }

}

const getEnvironmentVariables = (env) => {

    const pathKeyString = os.type() === 'Windows_NT' ? 'Path' : 'PATH';

    const windowsExecutableExtensions = env.PATHEXT?.split(path.delimiter)?.map((item) => item.toLowerCase());
    const systemEnvironmentPaths = env[pathKeyString]?.split(path.delimiter);

    return { systemEnvironmentPaths, windowsExecutableExtensions };

}