/**
 * Lumber-Storage
 * A storage engine that accept http requests with a json payload
 * @author Lawrence Goldstien @lgoldstien
 * @package Lumber-Storage
 * @version 0.1.0
 */

var fs          = require('fs'),
    crypto      = require('crypto'),
    _           = require('underscore'),
    config      = require('./config.js'),

    // Our custom server implementations
    srv_https   = require('./servers/https.js'),
    srv_ws      = require('./servers/websockets.js'),
    srv_syslog  = require('./servers/syslogd.js'),

    date = new Date();

var DB       = {
  Db         : require('mongodb').Db,
  Server     : require('mongodb').Server
};

var Storage  = {
  version: "0.1.0",
  // The actual server containers
  https: {},
  syslogd: {},
  websockets: {},
  mongo: {
    db: {},
    server: new DB.Server(config.db.host, config.db.port)
  },
  init: function () {
    // Create the http server
    this.createServers(config.server);
    
    // Create the mongodb instance
    this.mongo.db = new DB.Db(config.db.name, this.mongo.server, { w: config.db.write });
  },
  createServers: function (options) {
    // Set up the https server
    this.https = srv_https.server(options.https);
    srv_https.handler(this.https, this);

    // Set up the syslogd server
    this.syslogd = srv_syslog.server(options.syslogd);
    srv_syslog.handler(this.syslogd, this);
  },
  destroyServers: function () {
    this.https.shutdown(srv_https);
    this.syslogd.shutdown(srv_syslog);
  },
  responseKey: function (content) {
    var hash  = crypto.createHash('sha512')
                      .update(content)
                      .digest("hex");
    return hash;
  },
  dataStore: function (content) {
    // Extend with current time and other information
    _.extend(content, {
      time: date.toJSON()
    });

    if (content.type === "syslog") {
      //console.log(content);
    }
    // Store the data

    return true;
  },
  dataRetrieve: function (data) {
    return true;
  }
};

Storage.init();

process.on('exit', function() {
  setTimeout(function() {
    console.log("");
  }, 0);
  Storage.destroyServers();
});