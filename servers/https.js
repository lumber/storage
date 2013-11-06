/**
 * Lumber-Storage - https server
 * A storage engine that accept http requests with a json payload
 * @author Lawrence Goldstien @lgoldstien
 * @package Lumber-Storage
 * @version 0.1.0
 */

var https       = require('https');

exports.server = function (options) {
  return https.createServer(options).listen(options.port);
};

exports.handler = function (server, scope) {
  // On a request
  server.on('request', function (request, response) {
    request.content = '';
    // Add a listener for the data transmission
    request.addListener("data", function(chunk) {
      request.content += chunk;
    });
    // Add a listener for the end of transmission
    request.addListener("end", function() {
      if (request.content.length > 0) {
        if (request.method === "POST") {
          var content = JSON.parse(request.content);
          if (scope.dataStore(content) === true) {
            response.writeHead(202);
          } else {
            response.writeHead(406);
          }
        } else if (request.method === "GET") {
          
        } else {

        }
      } else {
        response.writeHead(406);
      }
      response.end(scope.responseKey(request.content));
    });
  });
  
}