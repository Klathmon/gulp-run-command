import { delimiter, resolve as pathResolve } from 'path'
import spawn from 'cross-spawn'
import spawnArgs from 'spawn-args'

export default function run (commands = [], options = {}) {
  const {
    env = {},
    quiet = false,
    ignoreErrors = false
  } = options

  return async () => {
    for (let command of (Array.isArray(commands) ? commands : [commands])) {
      try {
        await runCommand(command, env, quiet)
      } catch (err) {
        if (!ignoreErrors) {
          throw err
        }
      }
    }
  }
}

export function runCommand (command, env = {}, silent = false) {
  return new Promise((resolve, reject) => {
    const args = spawnArgs(command, { removequotes: 'always' })
    const proc = spawn(args.shift(), args, {
      stdio: (silent ? 'ignore' : 'inherit'),
      env: {
        ...process.env,
        PATH: process.env.PATH + delimiter + pathResolve(process.cwd(), 'node_modules', '.bin'),
        ...env
      }
    })

    proc.on('error', (err) => reject(err))

    proc.on('exit', (code) => {
      if (parseInt(code, 10) === 0) {
        resolve()
      } else {
        reject(new Error(`Non-zero exit code of "${code}"`))
      }
    })
  })
}
