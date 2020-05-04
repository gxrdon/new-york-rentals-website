const host = '0.0.0.0';
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dotenv = require('dotenv');
var moment = require('moment');
var exphbs = require('express-handlebars');
var handlebars = exphbs.handlebars;
var _ = require('underscore');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nodemailer = require('nodemailer');

var Apartment = require('./models/Apartment');
var tags = [];
var currSlug = "";
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: process.env.PORT || 2424,
  auth: {
    user: "1a2b3c4d5e6f7g",
    pass: "1a2b3c4d5e6f7g"
  }
});

dotenv.config();
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function(){
  console.log("Connection error to MongoDB");
  process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


function getTags(){
  return tags;
}

function addTags(tag){
  var i;
  for(i = 0; i < tag.length; i++){
    if(!~tags.indexOf(tag[i])){
      tags.push(tag[i]);
    }
  }
}

app.get("/",function(req, res){
  var tag = getTags();  
  var query = Apartment.find({})
  
  query.exec(function(err, apts){    
    if(err) throw err;
    res.render("home",{
      tags: tag,
      data: apts
    });
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/create", function(req, res){
  res.render("create");
});

app.post("/api/create", function(req, res){
  var body = req.body;
  var tag = body.amenities.split(", ");
  addTags(tag);
  
  var apt = new Apartment({
    title: body.title,
    price: body.price,
    bathrooms: parseFloat(body.bathrooms),
    bedrooms: parseInt(body.bedrooms),
    location: body.location,
    amenities: body.amenities,
    slug: body.slug,
    description: body.description,
    reviews: [],
    time: String(moment().format('MMMM Do YYYY, h:mm a'))
  });

  apt.save(function(err){
    if (err) throw err;
  });
  res.redirect("/");
});

app.get("/listing/:curr/writeReview", function(req, res){
  currSlug = req.params.curr;
  res.render('review');
});

app.post("/api/listing/writeReview", function(req, res){
  Apartment.findOne({slug: currSlug}).then(function(apt){    
    apt.reviews.push({
      rating: parseFloat(req.body.rating),
      title: req.body.title,
      name: req.body.name,
      comment: req.body.comment
    });
    apt.save(function(err){
      if(err) throw err;      
    });
  });
  res.redirect('/listing/' + currSlug);
});

app.post("/listing/:id/addReview", function(req, res){
  Apartment.findOne({_id: req.params.id}).then(function(apt){    
    if(!apt) res.send("That listing doesn't exist.")

    apt.reviews.push({
      rating: parseFloat(req.body.rating),
      title: req.body.title,
      name: req.body.name,
      comment: req.body.comment
    })
    apt.save(function(err){
      if(err) throw err;
      res.send("Review added.")
    });
  });
});

app.delete("/listing/:id", function(req, res){
  Apartment.findByIdAndRemove(req.params.id, function(apt){        
    if (!apt) return res.send("No listing with that id exists.");    
    res.send("Apartment listing was deleted successfully.")
  });
});

app.delete("/listing/:id/latestReview", function(req, res){
  Apartment.findOne({_id: req.params.id}).then(function(apt){    
    if(!apt) res.send("That listing doesn't exist.")
    apt.reviews.pop();
    apt.save(function(err){
      if(err) throw err;
      res.send("Review deleted.")
    });
  });
})

app.get("/api/allListingsRaw", function(req, res){
  Apartment.find({}, function(err, apts){
    if (err) throw err;
    res.render('json', {
      data: apts
    });
  });
});

app.get("/listing/:curr", function(req, res) {
  Apartment.find({slug: req.params.curr}, function(err, apts){
    if (err) throw err;    
    res.render('listing', {
      contents: apts,
      reviews: apts.reviews
    });
  });
});

app.get("/amenities/:curr", function(req, res){
  Apartment.find({amenities: {"$regex": req.params.curr}}, function(err, apts){
    if (err) throw err;    
    res.render('home', {
      data: apts
    });
  });
});

app.get("/listings/:curr", function(req, res) {
  var curr;
  if(req.params.curr == "StatenIsland"){
    curr = "Staten Island";
  }else{
    curr = req.params.curr;
  }
  var query = Apartment.find({location: {"$regex": curr}}); 
  query.exec(function(err, apts){
    if (err) throw err;
    res.render('home', {
      data: apts     
    });
  });
});

app.get('/chatRoom', function(req, res){
  res.render('chatroom')
});

io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

app.get("/listing/:curr/sendMail", function(req, res){
  currSlug = req.params.curr;
  res.render('sendmail');
});

app.post("/sendMail", function(req, res){
  var body = req.body;
  var mail = {
    from: body.from,
    to: "user@gmail.com",
    subject: body.subject,
    text: body.text
  };

  transport.sendMail(mail, (error, info) => {    
    console.log('Message sent.');
  });

  res.redirect('/listing/' + currSlug);
})

http.listen(process.env.PORT || 3000, function() {
    console.log('Listening...');
});
