let express = require('express'); 
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
let path2Views=__dirname+"/views/";

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('public'));
app.use(express.static('css'));

let db = [];

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('fit2095db');
    }
});


app.get('/', function(req, res){
    res.sendFile(path2Views+'5homepage.html');
});

app.get('/newtask', function(req, res){
    res.sendFile(path2Views+'5newtask.html');
});

app.post('/newtask', function(req, res){
    let id = ""+Math.floor(100000 + Math.random() * 900000)

    db.collection('week6').insertOne({
        id: id,
        name: req.body.name, 
        assign: req.body.assign, 
        due: req.body.due, 
        status: req.body.status, 
        desc: req.body.desc
    });
    res.redirect('/listtasks');
});

app.get('/listtasks', function(req, res){
    db.collection("week6").find({}).toArray(function (err, result) {
        res.render(path2Views+'5listtasks.html', {taskDb: result})
    });
});

app.get('/deletebyid', function(req, res){
    res.sendFile(path2Views+"deletebyid.html");
});

app.post('/deletebyid', function(req, res){
    let filter = {id: req.body.id};
    db.collection("week6").deleteOne(filter);
    res.redirect('/listtasks');
});

app.get('/deleteall', function(req, res){
    res.sendFile(path2Views+"deleteAll.html");
});

app.post('/deleteall', function(req, res){
    db.collection("week6").deleteMany({}, function (err, obj) {
        console.log(obj.result);
    });
    res.redirect('/listtasks');
});

app.get('/update', function(req, res){
    res.sendFile(path2Views+"update.html");
});

app.post('/update', function(req, res){
    let filter = {id: req.body.id};
    let update = {$set: {status: req.body.status}};
    db.collection("week6").updateOne(filter, update);
    res.redirect('/listtasks')
});

/*app.get('/findNotTomorrow', function(req, res){
    res.sendFile(path2Views+"findNotTomorrow.html");
});

app.post('/findNotTomorrow', function(req, res){
    var today = new Date();
    var date = today.getFullYear+'-'+(today,getMonth()+1)+'-'+today.getDate();
    let query = {due: {$gt: date}};

    db.collection("week6").find({query}).toArray(function (err, result) {
        res.render(path2Views+'findNotTomorrow.html', {taskDb: result})
    });
});
*/

app.listen(8080);
