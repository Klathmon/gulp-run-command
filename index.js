import { delimiter, resolve as pathResolve } from 'path'
import promiseTimeout from 'timeout-as-promise'
import spawn from 'cross-spawn'
import spawnArgs from 'spawn-args'

const timedOutSymbol = Symbol('TIMED_OUT')

export default function run (command = [], options = {}) {
  // Expand and fill in the defaults for the options
  const {
    quiet = false,
    ignoreErrors = false,
    cwd = process.cwd(),
    timeout = undefined, // In milliseconds
    env = {}
  } = options

  // Ensure that commands is an array
  const commands = (Array.isArray(command) ? command : [command])

  // Returning an async function lets gulp know it's complete when the promise resolves
  return async () => {
    // Loop over each command and run them one-at-a-time
    for (let cmd of commands) {
      // Wrap it in a try/catch to ignore errors if ignoreErrors is set
      try {
        // Run the command and add the promise to the promise array
        const promiseArray = [runCommand(cmd, quiet,ignoreErrors, pathResolve(cwd), env)]
        // If timeout is set, then add that as a timebomb to the promise array
        if (typeof timeout !== 'undefined') promiseArray.push(promiseTimeout(parseInt(timeout, 10), timedOutSymbol))

        // Finally, await on a race between the promises to deal with the first of them
        const promiseResult = await Promise.race(promiseArray)

        // If the promise resolves with timedOutSymbol first, then throw an error
        if (promiseResult === timedOutSymbol) {
          throw new Error('Process timed out...')
        }
      } catch (err) {
        // Unless ignoreErrors is true, re-throw the caught error
        if (!ignoreErrors) {
          throw err
        }
      }
    }
  }
}

const runCommand = (command, quiet,ignoreErrors, cwd, env) => new Promise((resolve) => {
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
    if(!ignoreErrors){
      throw err
    }
    else
    {
      resolve()
    }
  })

  // On exit, check the exit code and if it's good, then resolve
  proc.on('exit', (code) => {
    if (parseInt(code, 10) === 0) {
      resolve()
    } else {
      if(!ignoreErrors){
        throw new Error(`Non-zero exit code of "${code}"`)
      }
      else
      {
        resolve()
      }
    }
  })
})
