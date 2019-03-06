console.log('hi')
var 
	express = require("express"),
	app=express(),
 	events = require('events'),
 	bodyParser = require('body-parser'),
 	util = require('util'),
 	fs = require('fs'),
 	response='';

app.set('view engine','ejs')
app.use('/style',express.static('assets'))
//support parsing of application/x-www-form-urlencoded post data such data from forms
app.use(bodyParser.urlencoded({ extended: true })); 
//support parsing of application/json data such data from apps
app.use(bodyParser.json());


app.get('/',function(req,res){
	res.render('menu')
})
app.get('/events',function(req,res){
	// res.writeHead(200, { "Content-Type": "text/html" });
	var persons =function(name){
		this.name=name
	}
	util.inherits(persons,events.EventEmitter);
	var person1=new persons('Samy');
	person1.on('sayHi',function(msg){
		response=person1.name+' say '+msg
	})
	person1.emit('sayHi','Hi')
	res.send(response);
});
app.get("/pipe",function(req,res){
	response=''
	var readStream=fs.createReadStream(__dirname+'/wiki.txt','utf8');
	readStream.pipe(res);
});
app.get("/pipesave",function(req,res){
	response=''
	var readStream=fs.createReadStream(__dirname+'/wiki.txt','utf8');
	var writeStream = fs.createWriteStream(__dirname+'/writewiki.txt');
	readStream.pipe(writeStream);
	response='pipe data saved'
	res.end(response);
});

app.get('/page/:pagename',function(req,res){
	// res.send(`your are in <b>${req.params.pagename}</b> page`)
	res.render('page',{name:req.params.pagename})
})

app.get('/profile/:profilename',function(req,res){
	// res.send(`your are in <b>${req.params.profilename}</b> profile`)
	res.render('profile',{name:req.params.profilename,age:req.query.age})
})
app.post('/profile',function(req,res){
	// res.send(`your are in <b>${req.params.profilename}</b> profile`)
	console.log(req.body)
	res.render('profile',{name:req.body.newName})
})
app.listen(3000)