interface Options {
    /**
     * Setting to `true` will ignore all output from the command (both stdout and stderr).
     * 
     * @default false
     */
    quiet: boolean;

    /**
     * Setting to `true` will ignore any errors that the command throws. 
     * It will also ignore return values.
     * 
     * @default false
     */
    ignoreErrors: boolean;

    /**
     * Sets the current working directory for the command.
     * This is where the `node_modules/.bin` is searched for as well to be added to the path.
     * 
     * @default `process.cwd()` 
     * @link http://nodejs.org/api/process.html#process_process_cwd
     */
    cwd: string;

    /**
     * The max time(in milliseconds) that the command is allowed to run.
     * 
     * @default undefined (no timeout)
     */
    timeout: number;

    /**
     * This object will be **added to** the normal environment, overwriting defaults with what you pass in.
     * So if your "main" environment includes`NODE_ENV="development"` and you pass in `{ NODE_ENV: "production"}`
     * the command will be run with `NODE_ENV="production"`.
     * 
     * @default {}
     */
    env: object
}

/**
 * A simple way to run command-line programs from gulp in a cross-platform way.
 * 
 * @param command
 * A command that will be run "as if you typed it in the console".
 * An array of commands will be run sequentially (waiting for each to finish before the next begins), stdin will be blank for all commands.
 * Commands will be run like they are from `npm scripts`. Locally installed modules can be run without having to prefix `node_modules/.bin`.
 * 
 * @param options
 * Additional options.
 * See {@link Options} for further details.
 * 
 * @return
 * Async function to let gulp know it's complete when the promise resolves
 * 
 * @example 
 * import gulp from 'gulp';
 * import run from 'gulp-run-command';
 * 
 * gulp.task('clean', run('rm -rf build'));
 * gulp.task('build', ['clean'], run('babel index.js --out-file index.es5.js', {
 *   env: { NODE_ENV: 'production' }
 * })); 
 */
declare function run(command: string | string[], options?: Options): () => Promise<void>;

export default run;
