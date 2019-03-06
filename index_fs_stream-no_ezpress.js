console.log('hi')
var http = require("http"),
 events = require('events'),
 util = require('util'),
 fs = require('fs'),
 response='';

http.createServer(function (req, res) {
	console.log(req.url);
	res.writeHead(200, { "Content-Type": "text/html" });
	switch(req.url){
		case '/':
		case '/index':
		case '/home':
			response='<a href="/events">events</a><br>';
			response+='<a href="/pipe">pipe streaming</a><br>';
			response+='<a href="/pipesave">pipe save streaming</a><br>';
			response+='<a href="/writeStream">normal write streaming</a><br>';
    	break;
    	case '/events':
			res.writeHead(200, { "Content-Type": "text/html" });
    		var persons =function(name){
				this.name=name
			}
			util.inherits(persons,events.EventEmitter);
			var person1=new persons('ali');
			person1.on('sayHi',function(msg){
				response=person1.name+' say '+msg
			})
			person1.emit('sayHi','yarb')
    	break;
    	case "/pipe":
    		response=''
    		var readStream=fs.createReadStream(__dirname+'/wiki.txt','utf8');
    		readStream.pipe(res);
    	break;
    	case "/pipesave":
    		response=''
    		var readStream=fs.createReadStream(__dirname+'/wiki.txt','utf8');
			var writeStream = fs.createWriteStream(__dirname+'/writewiki.txt');
    		readStream.pipe(writeStream);
    		response='pipe data saved'
    	break;
    	case "/writeStream":
    		response=''
    		var readStream=fs.createReadStream(__dirname+'/wiki.txt');
			var writeStream = fs.createWriteStream(__dirname+'/writewiki.txt');
			var i=0
    		readStream.on('data',function(chunk){
				console.log(":\n\n\n\n\n"+'chunk'+(i++)+":\n\n\n\n\n");
				// console.log(chunk);
				writeStream.write(chunk);
				response+="chunk "+(i++)+" saved <br>";
			})
    	break;
    	default:
    		response='404'
    	break;
	}
	if (response) {
	   	res.end(response);
	}
}).listen(8000)