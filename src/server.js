const cnf = require("./config/serverconfig.json");
const controller = require("./controller.js")
const http = require("http");
const AppDAO = require("./database/dao");
const PersonRepo = require("./repository/personRepository")

const hostPath = cnf.host + ":" + cnf.port

const server = http.createServer(controller);

const runSql = 0;

if (runSql) {
    PersonRepo.createTable();
    PersonRepo.createsSomeData();
}
 
server.listen(6969);

console.log("Server executed at " + hostPath);