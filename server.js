/**
 *  App Example
 */

var framework = require('./core/app.js');
var config = require('./config.js');

webapp = new framework.WebApp(__dirname,config.config);
webapp.start();
