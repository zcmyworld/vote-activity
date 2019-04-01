let log4js = require('log4js');
let logger = log4js.getLogger('vote-activity');
logger.level = 'debug';
module.exports = logger;