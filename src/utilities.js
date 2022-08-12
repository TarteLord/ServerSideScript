const {readFile, createReadStream} = require("fs");
const { extname, resolve } = require("path");
const { hrtime } = require("process");
const mimetypes = require("./mimetypes");

exports.sendText = function(req, res, msg, status = 200) {
	res.statusCode = status
	res.setHeader("Content-type", "text/plain")
	res.end(msg)
}

exports.sendJSON = function(req, res, msg, status = 200) {
	res.statusCode = status
	res.setHeader("Content-type", "application/json")
	res.end(JSON.stringify({message: msg}))
}

exports.sendFile = function(req, res, filename) {
	const ext = extname(filename);
	const type = mimetypes[ext].type;
	readFile(filename, function(err, filecontent) {
		if (err) {
			exports.sendJSON(req, res, {"error": err.message}, 404)
			return
		}
		res.statusCode = 200
		res.setHeader("Content-type", type);
		res.end(filecontent)
	})
}

exports.streamFile = function(req, res, filename) {
	const ext = extname(filename);
	const type = mimetypes[ext].type;
	const stream = createReadStream(filename);
	stream.on("error", function(err){
		console.log('err', err);7
		exports.sendJSON(req, res, {error: {msg: "Request failed "}}, 404);
		return;
	})
	res.statusCode(200);
	res.setHeader("Content-type", type);
	stream.pipe(res);
}

exports.redirect = function(res, url) {
	res.statusCode = 301;
	res.setHeader("Location", url);

	res.end();
}

exports.logger = function(req, res ) {
	const startTime = hrtime.bigint();
	let logStr = new Date().toISOString();
	logStr += ` ${req.method} ${req.url}`;
	res.on("finish", function(){
		const duration = Number(hrtime.bigint() - startTime) / 1000000;
		logStr += ` ${res.statusCode} ${res.statusMessage} ${duration}ms`;
		console.log(logStr);

	})
}

exports.getData = function (req) {
	return new Promise((resolve, reject) => {

		let body = "";

		req.on("error", () => {
			reject(new Error('Error of a kind'))
		})

		req.on("data", (chunk) => {
			body += chunk;
		});
		
		req.on("end", () => {

			try {
				console.log(JSON.parse(body));
				resolve(JSON.parse(body));

			} catch (error) {
				reject(new Error("Error: wrong input"))
			}
		});

	})
}

exports.validateJsonSchema = function (json, schema) {
	if(Object.keys(json).length != schema.length) {
		return false;
	}

	for (const prop in json) {
		if (!schema.includes(prop)) {
			return false;
		}
	}
	return true;
}
