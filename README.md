# gulp-run-command

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A simple way to run command-line programs from gulp in a cross-platform way.

## Installation

`npm install gulp-run-command`

## Usage
```js
import gulp from 'gulp'
import run from 'gulp-run-command' // or `var run = require('gulp-run-command').default` for ES5

gulp.task('clean', run('rm -rf build'))
gulp.task('build', ['clean'], run('babel index.js --out-file index.es5.js', {
  env: { NODE_ENV: 'production' }
}))

```

## API

### run(command, options)

#### commands

type: `Array` or `String`

A command will be run "as if you typed it in the console". An array of commands will be run sequentially (waiting for each to finish before the next begins), stdin will be blank for all commands. Commands will be run like they are from `npm scripts`, locally installed modules can be run without having to prefix `node_modules/.bin`.

#### options.quiet

type: `Boolean`  
default: `false`

Setting to `true` will ignore all output from the command (both stdout and stderr)

#### options.ignoreErrors

type: `Boolean`  
default: `false`

Setting to `true` will ignore any errors that the command throws. It will also ignore return values.

#### options.cwd

type: `String`  
default: [`process.cwd()`](http://nodejs.org/api/process.html#process_process_cwd)

Sets the current working directory for the command. This is where the `node_modules/.bin` is searched for as well to be added to the path.

#### options.timeout

type: `Number`  
default: `undefined` (no timeout)

The max time (in milliseconds) that the command is allowed to run

#### options.env

type: `Object`  
default: `{}`

This object will be **added to** the normal environment, overwriting defaults with what you pass in. So if your "main" environment includes `NODE_ENV="development"` and you pass in `{ NODE_ENV: 'production'}` the command will be run with `NODE_ENV="production"`.


## FAQ

**Why?**  
I loved Gulp's dependency management and plugin ecosystem, but I hated having to use file streams or plugins which wrap my tools which are often out of date, buggy, or missing functionality. This plugin lets you define gulp tasks as command line commands which will be run. Most tools have a command line interface, so you are cutting out several unnecessary layers and giving yourself more flexibility.

**What not just use [`gulp-shell`](https://github.com/sun-zheng-an/gulp-shell)?**  
`gulp-shell` is great, but sadly it uses [`child_process.exec`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback). That means that output from the plugin is buffered and only output in chunks. This causes issues with command line applications that are expecting direct access to the console. (it also has a tendency to strip colors from the output). This uses [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) which is more difficult to use, but works much better.

**Can you add this new feature?**  
Maybe... I'm trying to keep this a small single-purpose plugin, but if you want a feature feel free to open an issue and I'll take a look.

## Inspiration

* [`gulp-shell`](https://github.com/sun-zheng-an/gulp-shell) came up with the idea, I just changed it's underlying implementation.

## Contributing

The code is written in ES6 using [Javascript Standard Style](https://github.com/feross/standard). Feel free to make PRs adding features you want, but please try to follow Standard. Also, codumentation/readme PRs are more then welcome!

## License

[MIT](LICENSE.md) Copyright (c) [Gregory Benner](https://github.com/Klathmon)
