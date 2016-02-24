var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session');
if (process.env.NODE_ENV !== "production") {
    require('dot-env')
}
var mongodb = require('mongodb');


var isLoggedIn = require('./auth.js').isLoggedIn
var register = require('./auth.js').register
var login = require('./auth.js').login
var logout = require('./auth.js').logout
var initialize = require('./auth.js').initialize

var putStatus = require('./user.js').putStatus
var getStatus = require('./user.js').getStatus
var addPost = require('./user.js').addPost
var hello = require('./user.js').hello
var helloUser = require('./user.js').helloUser
var getPost = require('./user.js').getPost
var samplePosts = require('./user.js').samplePosts
var getPostOfID = require('./user.js').getPostOfID
var getFollowing = require('./user.js').getFollowing
var putFollowing = require('./user.js').putFollowing
var deleteFollowing = require('./user.js').deleteFollowing
var getEmail = require('./user.js').getEmail
var putEmail = require('./user.js').putEmail
var putPicture = require('./user.js').putPicture
var getPicture = require('./user.js').getPicture
var putPassword = require('./user.js').putPassword
var putZipcode = require('./user.js').putZipcode
var getZipcode = require('./user.js').getZipcode

var app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(enableCORS)
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.post('/register', register)
app.post('/login', login)
app.put('/logout', isLoggedIn, logout)
app.post('/post',isLoggedIn, addPost)
app.get('/status', isLoggedIn, getStatus)
app.get('/sample', samplePosts)
app.get('/posts', isLoggedIn, getPost)
app.get('/posts/:id',isLoggedIn, getPostOfID)
app.post('/logout',isLoggedIn, logout)
app.put('/status', isLoggedIn, putStatus)
app.get('/following/:user', isLoggedIn, getFollowing)
app.put('/following/:user',isLoggedIn, putFollowing)
app.delete('/following/:user',isLoggedIn, deleteFollowing)
app.get('/email/:user', isLoggedIn, getEmail)
app.put('/email', isLoggedIn, putEmail)
app.put('/picture', isLoggedIn, putPicture)
app.get('/picture/:user', isLoggedIn, getPicture)
app.put('/password', isLoggedIn, putPassword)
app.put('/zipcode', isLoggedIn, putZipcode)
app.get('/zipcode/:user', isLoggedIn, getZipcode)
app.get('/', hello)

var accessconrol;
if(process.env.PORT)
  accessconrol = 'https://theconclave.herokuapp.com'
else
  accessconrol = 'http://localhost:8088'

function enableCORS(req,res, next){
  res.header('Access-Control-Allow-Origin', accessconrol);//'http://localhost:8000');//'http://theconclave.herokuapp.com');
  res.header('Access-Control-Allow-Credentials', "true");
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 8000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})
