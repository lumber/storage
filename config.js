/**
 * The configuration file
 * @author Lawrence Goldstien @lgoldstien
 * @package Lumber-Storage
 * @version 0.1.0
 */

var fs        = require('fs');

/**
 * The database options
 */
exports.db    = {
  name: "lumberStorage",
  host: "localhost",
  port: 27017,
  write: "majority"
};

/**
 * Server configuration
 */
exports.server = {
  https: {
    port: "8000",
    ip: "0.0.0.0",
    key:  fs.readFileSync("certs/key.pem"),
    cert: fs.readFileSync("certs/cert.pem")
  },
  websockets: {
    port: "8001"
  },
  syslogd: {
    port: "514"
  }
};

/**
 * Client configuration
 */
exports.client = {
  key: "CHANGEmeTOsomethingVERYrandomTRYgrc.COM/passwords.HTML"
}

// Include static config files
exports.strings = require('./config/strings');