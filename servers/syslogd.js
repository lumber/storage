/**
 * Lumber-Storage - syslogd server
 * A storage engine that accept http requests with a json payload
 * @author Lawrence Goldstien @lgoldstien
 * @package Lumber-Storage
 * @version 0.1.0
 */

var config        = require('../config.js'),
    dgram         = require("dgram"),
    glossy        = require("glossy"),

    syslogParser  = require("glossy").Parse;

exports.server = function (options) {
  var server4 = dgram.createSocket("udp4");
  var server6 = dgram.createSocket("udp6");

  server4.on("listening", function() {
    var address = server4.address();
    console.log(config.strings.logging.SYSLOGD.STARTING + options.port + "ipv4");
  });

  server6.on("listening", function() {
    var address = server4.address();
    console.log(config.strings.logging.SYSLOGD.STARTING + options.port + "ipv6");
  });

  server4.bind(options.port);
  server6.bind(options.port);

  return {
    server4: server4,
    server6: server6
  };
};

exports.handler = function (server, scope) {
  server.server4.on("message", function(rawMessage, host) {
    syslogParser.parse(rawMessage.toString('utf8', 0), function(parsedMessage){
      scope.dataStore({ type: "syslog", host: host, content: parsedMessage });
    });
  });

  server.server6.on("message", function(rawMessage, host) {
    syslogParser.parse(rawMessage.toString('utf8', 0), function(parsedMessage){
      scope.dataStore({ type: "syslog", host: host, content: parsedMessage });
    });
  });
};

exports.shutdown = function (server) {
  server.server4.close();
  server.server6.close();
  console.log(config.strings.logging.SYSLOGD.STOPPING);
};