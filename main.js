/**
 * Lumber-Storage
 * A storage engine that accept http requests with a json payload
 * @author Lawrence Goldstien @lgoldstien
 * @package Lumber-Storage
 * @version 0.1.0
 */

var https 	 = require('https'),
    fs 		   = require('fs'),
    crypto   = require('crypto'),
    _        = require('underscore'),
    config   = require('./config.js');

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
    this.createServer(config.server);
    
    // Create the mongodb instance
    this.mongo.db = new DB.Db(config.db.name, this.mongo.server);
  },
  createServer: function (options) {
    var _this = this;
    https.createServer(options, function (req, res) {
      // Add a listener for the data transmission
      req.addListener("data", function(chunk) {
        req.content += chunk;
      });
      // Add a listener for the end of transmission
      req.addListener("end", function() {
        if (req.method === "POST") {
          if (_this.dataStore(req.content) === true) {
            res.writeHead(202);
          } else {
            res.writeHead(406);
          }
        } else if (req.method === "GET") {

        } else {

        }
        res.end(_this.responseKey(req.content));
      });
    }).listen(options.port);
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

    
    return true;
  },
  dataRetrieve: function (data) {
    return true;
  }
};

Storage.init();