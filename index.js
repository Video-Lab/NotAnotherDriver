var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

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
    res.send("test")
})
app.get('/score/:id', function(req,res){
    res.send("test")
})

app.listen(3000);