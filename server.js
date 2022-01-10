//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

//..............Create an Express server object..................//
const app = express();

//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library

//.............Define server routes..............................//
//Express checks routes in the order in which they are defined

app.get('/', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index");
});

app.get('/draw', function(request, response) {
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("draw", {
      data: users
    });
});

app.get('/garden', function(request, response) {
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("garden", {
      data: users
    });
});

app.post('/garden', function(request, response) {
    let username = request.body.username;
    if(username){
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.redirect("/user/"+username);
    }else{
      response.status(400);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"400"
      });
    }
});

app.get('/results', function(request, response) {
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    let plants = JSON.parse(fs.readFileSync('data/plants.json'));

    //accessing URL query string information from the request object
    let user = request.query.user;
    let sample = plants.plant1;

    //let plant = request.query.plant;
    if(users[user]){
      let results = {};
      results["user"] = user;
      results["card"] = sample;

      //update data store to permanently remember results
      fs.writeFileSync('data/users.json', JSON.stringify(users));

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render("results", {
        data: results
      });
    }
    else {
      response.status(404);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"404"
      });
    }
});

app.get('/scores', function(request, response) {
  let users = JSON.parse(fs.readFileSync('data/users.json'));
  let userArray = [];

  //create an array to use sort, and dynamically generate win percent
  for (user in users){
    console.log(users[user]);
    userArray.push(users[user]);
  }
  /*opponentArray.sort(function(a, b){
    return parseFloat(b.rarest)-parseFloat(a.rarest);
  });*/

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("scores",{
    users: userArray
  });
});

app.get('/user/:username', function(request, response) {
  let users = JSON.parse(fs.readFileSync('data/users.json'));

  // using dynamic routes to specify resource request information
  let username = request.params.username;

  if(users[username]){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("userDetails",{
      user: users[username]
    });

  }else{
    response.status(404);
    response.setHeader('Content-Type', 'text/html')
    response.render("error", {
      "errorCode":"404"
    });
  }
});

app.get('/createAccount', function(request, response) {
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("createAccount");
});

app.post('/createAccount', function(request, response) {
    let username = request.body.username;
    if(username){
      let users = JSON.parse(fs.readFileSync('data/users.json'));
      let newUser={
        "username": username,
        "rarest": "",
        "collection": [],
      }
      users[username] = newUser;
      fs.writeFileSync('data/users.json', JSON.stringify(users));

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.redirect("/user/"+username);
    }else{
      response.status(400);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"400"
      });
    }
});

// Because routes/middleware are applied in order,
// this will act as a default error route in case of
// a request fot an invalid route
app.use("", function(request, response){
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode":"404"
  });
});

//..............Start the server...............................//
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server started at http://localhost:'+port+'.')
});
