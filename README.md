# Description
A clone of the 'which' command line utility from Linux that works on Linux and Windows.

There is an additional feature for Windows which allows you to input the command without its executable extension (such as '.exe') and the app will find the extension(s) for you.

# Requirements
v22.0.0

# Set Up
Navigate to the root of this repository in your command line and run `npm install`.

# How to Use
Navigate to the root of this repository in your command line and run `node which <arguments>`
Alternatively, you can add the 'which.bat' or 'which.sh' to the System Environment Path (Windows) / PATH (Linux) Variable to be able to run this app globally using `which <arguments>`. You will then be able to run the `which which` command!