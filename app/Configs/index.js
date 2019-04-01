let process = require('process');
let NODE_ENV = process.env.NODE_ENV;
let CONFIG_PATH = 'local';

if (NODE_ENV == 'dist') {
  CONFIG_PATH = 'dist';
}

let db = require(`./${CONFIG_PATH}/db`);
let system = require(`./${CONFIG_PATH}/system`);
let session = require(`./${CONFIG_PATH}/session`);

module.exports = {
  db: db,
  system: system,
  session: session
}