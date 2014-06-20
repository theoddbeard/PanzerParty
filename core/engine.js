/**
 * HTTP Engine
 */

var http = require('http');
var router = require('./router.js');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var mime = require('mime');

var engine = function(config){
	console.log(config);
	
	var modules = {};
	
	function loadModule(module){
		
		var modulePath = config.root+config.path.controllers+''+module+'.js';
		console.log('Search module '+modulePath);
		if(fs.existsSync(modulePath)){
			try{
				modules[module] = require(modulePath);
				console.log('Loading success!');
				return true;
			} catch(e){
				return false;
			}
				
		} 
		console.log('Module '+module+' not found in '+config.path.controllers);
		return false;
		
	}
	
	function resolveStatic(req,resp){
		console.log('Search '+config.root+config.path.statics+req.url.pathname);
		if (fs.existsSync(config.root+config.path.statics+req.url.pathname)){
			console.log('Found static resource at '+req.url.pathname);
			var mimetype = mime.lookup(config.root+config.path.statics+req.url.pathname);
			fs.readFile(config.root+config.path.statics+req.url.pathname,  function(err,data){
				resp.writeHead(200,{
				    "Content-type":mimetype,
				    "Content-length":data.length
				});
				resp.write(data,'binary');
				resp.end();
			});
			return true;
		} else {
			return false;
		}
	}
	
	
	function resolveDynamic(req,resp){
		var pathParts = req.url.pathname.split('.');
		if (pathParts.length==1){
			pathParts[1] = 'html';
		}
		var methodPath = pathParts.slice(0,pathParts.length-1).join('.');
		var viewName = pathParts[pathParts.length-1];
		console.log('Parts='+pathParts.slice(0,1));
		console.log('Method path='+methodPath);
		console.log('View='+viewName);
		
		var path = methodPath.split('/');
		
		if (path.length>=3){
			var methodName = path[path.length-1];
			var className = path[path.length-2];
			var moduleName = path.slice(0,path.length-2).join('/');
			
			console.log('Module='+moduleName);
			console.log('Class='+className);
			console.log('Method='+methodName);
			
			if (typeof(modules[moduleName])==='undefined'){
				if (loadModule(moduleName)){
					module = modules[moduleName];
					console.log(typeof(module[className]));
					if (typeof(module[className])==='function'){
						var ctrlConstructor = module[className];
						var ctrl = new ctrlConstructor();
						console.log(typeof(ctrl));
						if (typeof(ctrl)==='object'&&typeof(ctrl[methodName])==='function'){
							ctrl[methodName].apply(ctrl);
						}
					}
				}
			}
		}
		return false;
	}
	
	var server = http.createServer(function(req,resp){
		console.log('Resolving request '+req.url);
		req.url = url.parse(req.url,true);
		
		if (!resolveStatic(req, resp)){
			if (!resolveDynamic(req, resp)){
				resp.statusCode = 404;
				resp.write('Error!');
				resp.end();
			}			
		}
	});
	
	this.start = function(){
		console.log('Starting HTTP server on port '+config.port);
		server.listen(config.port);
	};
	
	
};


exports.Engine = engine;

