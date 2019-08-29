let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
let path2Views=__dirname+"/views/";

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('public'));
app.use(express.static('css'));

let db = [];

app.get('/', function(req, res){
    res.sendFile(path2Views+'5homepage.html');
});

app.get('/newtask', function(req, res){
    res.sendFile(path2Views+'5newtask.html');
});

app.post('/newtask', function(req, res){
    console.log('hello');

    db.push(req.body);
    res.render(path2Views+'5listtasks.html', {taskDb: db});
    console.log(db);
});

app.get('/listtasks', function(req, res){
    res.render(path2Views+'5listtasks.html', {taskDb: db});
});

app.listen(8080);
