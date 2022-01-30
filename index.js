var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
var fs = require('fs');

app.get('/', function(req,res) {
    res.render('index', {title: 'Home'})
})

app.get('/menu', function(req,res){
    res.render('menu', {title: 'Menu'})
})

app.get('/drive', function(req,res) {
    res.render('drive', {title: 'Drive'})
})

app.get('/scores', function(req,res){
    var ids = []
    data = fs.readFileSync("./public/misc/generated.txt").toString();
    ids = data.split("\n")

    res.render("scores", {title: 'Driving Reports', ids: ids})
})
app.get('/scores/:id', function(req,res){
    data = fs.readFileSync("./data/score_" + req.params.id + ".json").toString();
    score = JSON.parse(data);
    score.score = score.score.toPrecision(2);
    res.render("report", {title: "Driving Report", score: score})
})

app.listen(3000);