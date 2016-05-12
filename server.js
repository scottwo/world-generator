// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
var express = require('./config/express');
var JSData = require('js-data');
var DSMongoDBAdapter = require('js-data-mongodb');

var store = new JSData.DS();
var adapter = new DSMongoDBAdapter('mongodb://localhost:27017/world-development');

// "store" will now use the MongoDB adapter for all async operations
store.registerAdapter('mongodb', adapter, {default: true});

exports.store = store;

// Create a new Express application instance
var app = express();

// Use the Express application instance to listen to the '3000' port
app.listen(8000);

// Log the server status to the console
console.log('Server running at http://localhost:8000/');

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;
