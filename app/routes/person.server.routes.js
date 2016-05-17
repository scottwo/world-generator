// Invoke 'strict' JavaScript mode
'use strict';

// Load the 'users' controller
var person = require('../../app/controllers/person.server.controller');
var Person = require('../../app/models/person.server.model').Person;

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'users' base routes
	app.route('/person')
	   .post(person.create)
	   .get((req, res, next) => {
       return Person.findAll(req.query).then(persons => {
         return res.status(200).send(persons).end();
       }).catch(next);
     });

	// Set up the 'users' parameterized routes
	app.route('/person/:id')
	   .get((req, res, next) => {
       return Person.find(req.params.id).then(person => {
         return res.status(200).send(person).end();
       }).catch(next);
     })
     .post((req, res, next) => {
       return Person.create({name: req.params.id}).then(person => {
         return res.status(200).send(person).end();
       }).catch(next);
     })
	  //  .put(users.update)
	  //  .delete(users.delete);

	// Set up the 'userId' parameter middleware
	// app.param('id', users.userByID);
};
