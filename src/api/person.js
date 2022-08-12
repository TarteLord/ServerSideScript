const { sendJSON, getData, validateJsonSchema } = require("../utilities")
const { db } = require('../database/dao')
const PersonRepo = require("../repository/personRepository")


const currentRoute = "/api/person";


module.exports = {
	GET:{
		handler : function(req, res, param){
			const response = {
				route: currentRoute,
				method: req.method
			}

			if (param) {

				try {
					PersonRepo.getById(param.split("/").pop())
					.then((data) => {
						response.person = data
						sendJSON(req, res, response)
					})
					return
				} catch (error) {
					sendJSON(req, res, {error: "Something went wrong"}, 404)
				}
				
			}

			PersonRepo.getAll().then((data) => {
				response.persons = data
				sendJSON(req, res, response)
			}).catch((err) => {
				sendJSON(req, res, {error: "Something went wrong"}, 404)
			})
		}
	},
	POST:{
		handler : function(req, res, param){

			const response = {
				route: currentRoute,
				method: req.method
			}

			if (param)
			{
				response.error = "Params not allowed on POST";
				sendJSON(req,res,response, 400);
				return;
			}

			
			getData(req)
				.then((input) => {
					const schema = ["name", "email", "note", "isStudent"];
					
					if (input == "error") {	
						response.error = "Error, check request";
						sendJSON(req,res, response, 404);
						return;
					}
					
					if (!validateJsonSchema(input, schema)) {
						response.error = "Schema is not a match";
						sendJSON(req, res, response, 422);
						return;
					}
					PersonRepo.create(input.name, input.email, input.note, input.isStudent).then((data) => {
						const person = {id: data.id, name: input.name, email: input.email, note: input.note, isStudent: input.isStudent }
						sendJSON(req, res, {msg: {person} }, 201)
					})
				})
				.catch(function() {
					
					response.error = "Error happened";
					sendJSON(req,res, response, 500);
				})
		}
	},

	PUT:{
		handler : function(req, res, param){
			const response = {
				route: currentRoute,
				method: req.method
			}

			if (!param)
			{
				sendJSON(req, res, {error: {msg: "missing ID on person"}}, 400)
				return

			}

			getData(req)
			.then((input) => {
				const schema = ["name", "email", "note", "isStudent"]

				if (!validateJsonSchema(input, schema)) {
					sendJSON(req, res, {error: {msg: "Schema is wrong"}}, 422)
					return
				}

				const person = {id: parseInt(param.split("/").pop()), name: input.name, email: input.email, note: input.note, isStudent: input.isStudent};			
				PersonRepo.update(person).then((data) => {
					sendJSON(req, res, {msg: {person}}, 201)
				})
			}).catch(function() {
				sendJSON(req, res, {error: {msg: "Error happened"}}, 500)
			})

		}
	},
	DELETE:{
		handler : function(req, res, param){
			const response = {
				route: currentRoute,
				method: req.method,
				id: param
			}

			if (!param) {
				sendJSON(req, res, {error: {msg: "A parameter is missing"}}, 400)
				return
			}

			try {
				PersonRepo.delete(String(param.split('/').pop())).then((data) => {
					response.msg = "Person succefully deleted";
					sendJSON(req, res, response, 204)
				})
				return
			} catch (error) {
				sendJSON(req, res, {error: {msg: "Person does not exist"}}, 404)
			}
		}
	},
}