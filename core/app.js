/**
 * Main framework
 */

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var mime = require('mime');

var engineMod = require('./engine.js')


var WebApp = function(path,config){
	console.log('Starting PanzerParty at '+path);
	var basepath = path;
	
	function checkConfig(config){
		if (typeof(config.port)==='undefined')
			config.port = 8090;
		if (typeof(config.path)==='undefined')
			config.path = {};
		if (typeof(config.path.statics==='undefined'))
			config.path.statics = '/static';
		if (typeof(config.path.modules==='undefined'))
			config.path.modules = '/modules';
		if (typeof(config.path.controllers)==='undefined')
			config.path.controllers = '/controllers';
		if (typeof(config.path.views)==='undefined')
			config.path.views='/views';
		if (typeof(config.path.layouts)==='undefined')
			config.path.layuots='/layouts';
		if (typeof(config.path.l10n)==='undefined')
			config.path.l10n='/l10n';
		if (typeof(config.controllers)==='undefined')
			config.controllers = [];				
	}
	
	config.root = basepath;
	checkConfig(config);
	
	var engine = new engineMod.Engine(config);
	
	
	this.start = function(){
		engine.start();
	};

};

exports.WebApp = WebApp;