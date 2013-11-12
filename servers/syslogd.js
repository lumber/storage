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
  var serverV4 = dgram.createSocket("udp4");
  var serverV6 = dgram.createSocket("udp6");

  serverV4.on("listening", function() {
    var address = serverV4.address();
    console.log(config.strings.logging.SYSLOGD.STARTING + options.port + "ipv4");
  });

  serverV6.on("listening", function() {
    var address = serverV4.address();
    console.log(config.strings.logging.SYSLOGD.STARTING + options.port + "ipv6");
  });

  serverV4.bind(options.port);
  serverV6.bind(options.port);

  return {
    serverV4: serverV4,
    serverV6: serverV6
  };
};

exports.handler = function (server, scope) {
  server.serverV4.on("message", function(rawMessage, host) {
    syslogParser.parse(rawMessage.toString('utf8', 0), function(parsedMessage){
      scope.dataStore({ type: "syslog", ip: "v4", host: parsedMessage.host, content: parsedMessage });
    });
  });

  server.serverV6.on("message", function(rawMessage, host) {
    syslogParser.parse(rawMessage.toString('utf8', 0), function(parsedMessage){
      scope.dataStore({ type: "syslog", ip: "v4", host: parsedMessage.host, content: parsedMessage });
    });
  });
};

exports.shutdown = function (server) {
  server.serverV4.close();
  server.serverV6.close();
  console.log(config.strings.logging.SYSLOGD.STOPPING);
};