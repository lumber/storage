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
    srv_syslog  = require('./servers/syslogd.js');

var DB       = {
  Db         : require('mongodb').Db,
  Server     : require('mongodb').Server
};

var Storage  = {
  version: "0.1.0",
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
    var https = srv_https.server(options.https);
    srv_https.handler(https, this);

    // Set up the syslogd server
    var syslogd = srv_syslog.server(options.syslogd);
    srv_syslog.handler(syslogd, this);
  },
  responseKey: function (content) {
    var hash  = crypto.createHash('sha512')
                      .update(content)
                      .digest("hex");
    return hash;
  },
  dataStore: function (content) {
    // If there is no type set then run away
    if (_.isUndefined(content.type)) {
      return false;
    }

    // If there is no host then run away
    if (_.isUndefined(content.host)) {
      return false;
    }

    // If there is no data then run away
    if (_.isUndefined(content.data)) {
      return false;
    }

    // If there is no encryption key then run away
    if (_.isUndefined(content.key)) {
      return false;
    }

    // Store the data

    return true;
  },
  dataRetrieve: function (data) {
    return true;
  }
};

Storage.init();