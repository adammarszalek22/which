const os = require('os');
const fs = require('fs');
const path = require('path');
const { getCommandPaths } = require('./../src/command-path-retriever.js');

// In all of the below tests we temporarily create the executable files in the test/test-files folder and then delete them after testing

// Using os.homedir() instead of __dirname because using __dirname was breaking Linux tests when ran on wsl
const testFilesPath = path.join(os.homedir(), 'test-files');

const windowsDescribe = (os.type() === 'Windows_NT' ? describe : describe.skip);
const linuxDescribe = (os.type() === 'Linux' ? describe : describe.skip);

windowsDescribe('windows tests of the getCommandPaths function', () => {

    beforeEach(deleteTestFilesFolder);
    afterEach(deleteTestFilesFolder);

    const windowsExecutables = ['.com', '.exe', '.bat', '.cmd', '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh', '.msc'];

    const basicTestFiles = [
        'java.exe',
        'some-folder/java.exe',
        'some-folder/nodejs.exe',
        'some-other-folder/python.exe'
    ];

    const environmentPaths = [
        `${testFilesPath}`,
        `${testFilesPath}/some-folder`
    ];

    const env = {
        Path: environmentPaths.join(path.delimiter),
        PATHEXT: windowsExecutables.join(path.delimiter)
    };

    test('should return the correct path that appears first in the env.Path environment variable for the specific command', () => {

        createTestFiles(basicTestFiles);

        expect(getCommandPaths('java.exe', false, env)).toEqual([{ pathVariable: `${testFilesPath}` }]);
        expect(getCommandPaths('nodejs.exe', false, env)).toEqual([{ pathVariable: `${testFilesPath}/some-folder` }]);

    });


    test('should return the suggested extensions when the command has no extension', () => {

        createTestFiles(basicTestFiles);

        expect(getCommandPaths('java', false, env)).toEqual([{ correctedCommand: 'java.exe', pathVariable: `${testFilesPath}` }]);
        expect(getCommandPaths('nodejs', false, env)).toEqual([{ correctedCommand: 'nodejs.exe', pathVariable: `${testFilesPath}/some-folder` }]);

    });

    test('should return all paths for a command when the showAllPaths argument is set to true', () => {

        createTestFiles(basicTestFiles);

        expect(getCommandPaths('java.exe', true, env)).toEqual([{ pathVariable: `${testFilesPath}` }, { pathVariable: `${testFilesPath}/some-folder` }]);
        expect(getCommandPaths('nodejs.exe', true, env)).toEqual([{ pathVariable: `${testFilesPath}/some-folder` }]);

    });

    test('should not return anything when the command path is not included in the env.Path', () => {

        createTestFiles(basicTestFiles);

        expect(getCommandPaths('python.exe', false, env)).toEqual([]);

    });

    test('should not return anything if the extensions are not in the env.PATHEXT', () => {

        createTestFiles(basicTestFiles);

        expect(getCommandPaths('java.exxe', false, env)).toEqual([]);
        expect(getCommandPaths('nodejs.exee', false, env)).toEqual([]);

    });

});

linuxDescribe('linux tests of the getCommandPaths function', () => {

    beforeEach(deleteTestFilesFolder);
    afterEach(deleteTestFilesFolder);

    const basicTestFiles = [
        'java',
        'some-folder/java',
        'some-folder/nodejs.exe',
        'some-other-folder/python'
    ];

    const environmentPaths = [
        `${testFilesPath}`,
        `${testFilesPath}/some-folder`
    ];

    const env = {
        PATH: environmentPaths.join(path.delimiter)
    };

    test('should return the correct path that appears first in the env.PATH environment variable for the specific command', () => {

        createTestFiles(basicTestFiles, true);

        expect(getCommandPaths('java', false, env)).toEqual([{ pathVariable: `${testFilesPath}` }]);
        expect(getCommandPaths('nodejs.exe', false, env)).toEqual([{ pathVariable: `${testFilesPath}/some-folder` }]);

    });

    test('should return all paths for a command when the showAllPaths argument is set to true', () => {

        createTestFiles(basicTestFiles, true);

        expect(getCommandPaths('java', true, env)).toEqual([{ pathVariable: `${testFilesPath}` }, { pathVariable: `${testFilesPath}/some-folder` }]);
        expect(getCommandPaths('nodejs.exe', true, env)).toEqual([{ pathVariable: `${testFilesPath}/some-folder` }]);

    });

    test('should not return anything if the extension specified is different from the one in env.PATH', () => {

        createTestFiles(basicTestFiles);

        expect(getCommandPaths('java.sh', false, env)).toEqual([]);

    });

    test('should not return anything when the command path is not included in the env.PATH', () => {

        createTestFiles(basicTestFiles);

        expect(getCommandPaths('python', false, env)).toEqual([]);

    });

    // test('should not return anything when the command path included in the env.PATH is not an executable', () => {

    //     createTestFiles(basicTestFiles);

    //     expect(getCommandPaths('java', false, env)).toEqual([]);

    // });

});

function createTestFiles(filePaths, executable) {

    for (const filePath of filePaths) {

        const fullPath = path.join(testFilesPath, filePath);

        fs.mkdirSync(path.dirname(fullPath), { recursive: true });

        fs.writeFileSync(fullPath, '');

        if (os.type() === 'Linux') {

            fs.chmodSync(fullPath, executable ? 0o755 : 0o644); // rwxr-xr-x vs rw-r--r--

        }

    }

}

function deleteTestFilesFolder() {

    if (fs.existsSync(testFilesPath)) {
        fs.rmSync(testFilesPath, { recursive: true, force: true });
    }

}
