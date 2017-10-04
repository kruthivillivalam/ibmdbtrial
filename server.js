'use strict';
/*#! /usr/bin/env node
eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

const server = require('./app');
const express = require('express');

// This application uses express as its web server
// for more info, see: http://expressjs.com
//var express = require("express");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require("cfenv");

// create a new express server
//var server = express();

// serve the files out of ./public as our main files
server.use(express.static(__dirname + "/public"));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
server.listen(appEnv.port, "0.0.0.0", function() {
  // print a message when the server starts listening
  console.log("Server starting on " + appEnv.url);
});
