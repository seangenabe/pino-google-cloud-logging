# pino-google-cloud-logging

[Pino](https://www.npmjs.com/package/pino) transport to Google Cloud Stackdriver Logging.

Falls back to simple logging of standard input.

## Options

Options can be passed via [rc](https://www.npmjs.com/package/rc) with module key `pgcl`.

* gclOptions - Options to pass to [`Logging`](https://cloud.google.com/nodejs/docs/reference/logging/1.2.x/Logging).
  * projectId
  * keyFilename
  * email
  * credentials
    * client_email
    * private_key
* gclLogName - The log name.
