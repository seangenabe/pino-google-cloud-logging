#!/usr/bin/env node
import { stdin } from 'pull-stdio'
import pull from 'pull-stream/pull'
import split from 'pull-split'
import Logging from '@google-cloud/logging'
import { ok } from 'assert'

export function googleCloudLoggingStream({ gclOptions, gclLogName }) {
  ok(gclLogName)
  const logging = new Logging(gclOptions)
  const log = logging.log(gclLogName)

  return function(read) {
    read(null, function next(end: true | Error | null, data: string) {
      if (end === true) return
      if (end) throw end

      let severity = 'info'
      const metadata: Record<string, any> = {}
      let entry

      try {
        const { level, msg } = JSON.parse(data)
        if (typeof level === 'number') {
          if (level >= 60) {
            severity = 'critical'
          } else if (level >= 50) {
            severity = 'error'
          } else if (level >= 40) {
            severity = 'warning'
          } else if (level >= 30) {
            severity = 'info'
          } else if (level >= 20) {
            severity = 'debug'
          } else {
            severity = 'default'
          }
        }
        Object.assign(metadata, data)
        entry = log.entry(metadata, msg)
      } catch (err) {
        entry = log.entry(metadata, data)
      }

      log[severity](entry).then(() => read(null, next), err => read(err, next))
    })
  }
}

if (require.main === module) {
  const rc = require('rc')
  const conf = rc('pgcl')
  pull(stdin(), split(), googleCloudLoggingStream(conf))
}
