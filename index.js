import { delimiter, resolve as pathResolve } from 'path'
import promiseTimeout from 'timeout-as-promise'
import spawn from 'cross-spawn'
import spawnArgs from 'spawn-args'

const timedOutSymbol = Symbol('TIMED_OUT')

export default function run (command, optionsOrArgs = {}, options = {}) {
  // Expand and fill in the defaults for the options
  const {
    quiet = false,
    ignoreErrors = false,
    cwd = process.cwd()
    env = {}
  } = (Array.isArray(optionsOrArgs) ? options : optionsOrArgs)

    // Wrap it in a try/catch to ignore errors if ignoreErrors is set
    try {
      // Run the command
      return runCommand(cmd, quiet, pathResolve(cwd), env)
    } catch (err) {
      // Unless ignoreErrors is true, re-throw the caught error
      if (!ignoreErrors) {
        throw err
      }
    }
  }
}

const runCommand = (command, quiet, cwd, env) => new Promise((resolve) => {
  // Parse out the args from the command
  const args = spawnArgs(command, { removequotes: 'always' })

  // Run the command
  const proc = spawn(args.shift(), args, {
    stdio: [
      'ignore', // ignore stdin
      (quiet ? 'ignore' : 'inherit'), // ignore or inherit stdout depending on quiet flag
      (quiet ? 'ignore' : 'inherit')  // ignore or inherit stderr depending on quiet flag
    ],
    cwd, // Set the current working directory
    env: {
      ...process.env, // Include the process's environment
      PATH: process.env.PATH + delimiter + pathResolve(cwd, 'node_modules', '.bin'), // Overwrite the path to include the node_modules/.bin directory
      ...env // And then layer over the passed-in environment
    }
  })

  // On error, throw the err back up the chain
  proc.on('error', (err) => {
    throw err
  })

  // On exit, check the exit code and if it's good, then resolve
  proc.on('exit', (code) => {
    if (parseInt(code, 10) === 0) {
      resolve()
    } else {
      reject(code)
    }
  })
})
