var HttpsProxyAgent = require('https-proxy-agent');
var url = require('url')
var socketio = require('socket.io-client');
var WebSocket = require('engine.io-client');

process.env.DEBUG = '*';

var proxy ='http://localhost:8080';
console.log('using proxy server %j', proxy);

// WebSocket endpoint for the proxy to connect to
var endpoint = 'https://secret-island-9820.herokuapp.com/';
// var endpoint = 'ws://echo.websocket.org';
var parsed = url.parse(endpoint);
console.log('attempting to connect to WebSocket %j', endpoint);

var opts = url.parse(proxy);

// IMPORTANT! Set the `secureEndpoint` option to `false` when connecting
//            over "ws://", but `true` when connecting over "wss://"
opts.secureEndpoint = parsed.protocol ? parsed.protocol == 'wss:' : false;
opts.secureEndpoint = true;

var agent = new HttpsProxyAgent(opts);

var io = socketio.connect(endpoint, {
  agent: agent
});
io.on('connect', function(){
  console.log("CONNEEEEECCCCCTTTTT");
});
io.on('open', function () {
  console.log('"open" event!');
  io.send('hello world');
});

io.on('message', function (data, flags) {
  console.log('"message" event! %j %j', data, flags);
  io.close();
});

// var httpProxy = require('http-proxy');

// var proxy = httpProxy.createServer({
//   target: 'http://localhost:8080',
//   ws: true
// });  
// proxy.listen(8081);

// var Http = require('http');
// // Http.globalAgent.options.secureProtocol = 'SSLv2_method';

// var req = Http.request({
//     host: 'localhost',
//     // proxy IP
//     port: 8080,
//     // proxy port
//     method: 'GET',
//     // path: 'http://www.google.com'
//     path: 'http://secret-island-9820.herokuapp.com/socket.io/?transport=polling'
// }, function (proxy_response) {
//   console.log(proxy_response.statusCode, proxy_response.headers)
//   // console.log(proxy_response);
//     proxy_response.addListener('data', function (chunk) { console.log(chunk.toString()); });
//     // proxy_response.addListener('end', function () { response.end(); });
//     // response.writeHead(proxy_response.statusCode, proxy_response.headers);
// });
// req.end();

// // req.addListener('response', function (proxy_response) {
// //   console.log(proxy_response);
// //     proxy_response.addListener('data', function (chunk) { console.log(chunk.toString()); response.write(chunk, 'binary'); });
// //     proxy_response.addListener('end', function () { response.end(); });
// //     response.writeHead(proxy_response.statusCode, proxy_response.headers);
// // });
// // req.on('data', function(){
// //   console.log(arguments);
// // })
// // req.on('error', function(err) {
// //    console.log('Error: found error in socket.io-proxy - error is: ' + err);
// //    console.log(err.stack);
// // });

// // request.addListener('data', function (chunk) { req.write(chunk, 'binary'); });
// // request.addListener('end', function () { req.end(); });
 
// // req.end();