# Description
A clone of the 'which' command line utility from Linux that works on Linux and Windows.

The which utility takes a list of command names and searches the path for each executable file that would be run had these commands actually been invoked.

There is an additional feature for Windows which allows you to input the command without its executable extension (such as '.exe') and the app will find the extension(s) for you.

# Requirements
Node v22.0.0 or higher

# Set Up
Navigate to the root of this repository in your command line and run `npm install`.

# How to Use
Navigate to the root of this repository in your command line and run `node which <arguments>`
Alternatively, you can add the 'which.bat' or 'which.sh' to the System Environment Path (Windows) / PATH (Linux) Variable to be able to run this app globally using `which <arguments>`. You will then be able to run the `which which` command!

For example:
```
which java.exe
```

Or to print all of the paths that contain this executable
```
which -a java.exe
```

You can also add multiple arguments at once:
```
which java.exe python.exe nodejs.exe
```

On Windows you do not need to specify the executable extension
```
which java python nodejs
```