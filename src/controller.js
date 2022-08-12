const cnf = require("./config/serverconfig.json");
const {sendText, sendJSON, sendFile, redirect, logger} = require("./utilities.js")
const hostPath = cnf.host + ":" + cnf.port
const api = {
	"person" : require("./api/person")
};

module.exports = function(req, res) {
	logger(req, res);
	const url = new URL(req.url, hostPath)

	const endpoint = url.pathname
	if (endpoint === "/") {
		redirect(res, "http://localhost:6969/html/index.html")
		return;
	}
	const regexMime = /^\/(html|css|js|img)\/[\w-]+\.(html|css|js|png|jpe?g)/

	const regexResMime = endpoint.match(regexMime)
	if (regexResMime) {
		// sendJSON(req, res, regexRes)
		sendFile(req, res, cnf.docroot + regexResMime[0])
		return
	}

	const regexApi = /^\/api\/(?<route>\w+)(?<param>\/\d+)?$/;
	const regexResApi = endpoint.match(regexApi);

	if (regexResApi) {
		if(api[regexResApi.groups.route]) { //Checks Api for the route, in this case cat

			if(api[regexResApi.groups.route][req.method]) {  //and then for method "Get, post etc." on cat
				api[regexResApi.groups.route][req.method].handler(req,res, regexResApi.groups.param);
				return;
			}
			sendJSON(req, res, {msg: `Method ${req.method} not allowed`}, 405);
			return;
		}
	}


	sendJSON(req, res, {msg: "Error in request", endpoint: endpoint}, 400)
}