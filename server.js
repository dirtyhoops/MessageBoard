var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/messages');

// var MessageSchema = new mongoose.Schema({
//     name: {type: String, required: [true, "Should have a name"]},
//     message: {type: String, required: [true, "should have a message"]},
// }, {timestamps: true})


// var CommentSchema = new mongoose.Schema({
//     name: {type: String, required: [true, "Should have a name"]},
//     comment: {type: String, required: [true, "should have a comment"]},
// }, {timestamps: true})

var CommentSchema = new mongoose.Schema({
    name: String,
    comment: String
})

var MessageSchema = new mongoose.Schema({
    name: String,
    message: String,
    comments: [CommentSchema]
})


mongoose.model('Message', MessageSchema);
var Message = mongoose.model('Message') 


mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment') 
// Use native promises
mongoose.Promise = global.Promise;


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


//root route and displays all the mongooses
app.get('/', function(req, res) {
    Message.find({}, function(err, messages) {
        if(err) {
            console.log(err);
        } 
        res.render('index', {messages1: messages});
    })
});

app.post('/message', function(req, res){
    console.log("POST DATA", req.body);
    var message = new Message({name: req.body.name, message: req.body.message});
    message.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong');
        } else { 
            console.log('successfully added a new message');
        }
        res.redirect('/');
    })
})

app.post('/comment/:id', function(req, res){
    console.log("POST DATA", req.body);
    Comment.create(req.body, function(err, data) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong');
        } else { 
            Message.findOneAndUpdate({_id: req.params.id}, {$push: {comments : data}}, function(err, data) {
                if(err){
                    console.log(err);
                } else {
                    console.log('successfully added a new comment');
                }
            })  
        }
        res.redirect('/');
    })
})



// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})