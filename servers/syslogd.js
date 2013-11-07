/**
 * Lumber-Storage - syslogd server
 * A storage engine that accept http requests with a json payload
 * @author Lawrence Goldstien @lgoldstien
 * @package Lumber-Storage
 * @version 0.1.0
 */

var config      = require('../config.js');

exports.server = function (options) {
  console.log(config.strings.logging.SYSLOGD.STARTING + options.port);
  return;
};

exports.handler = function (server, scope) {
  
}