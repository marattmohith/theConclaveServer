var md5 = require('md5')
var cookieKey = 'sid';
var mongodb = require('mongodb');
var uri = 'mongodb://marattmohith:conclave@ds027415.mongolab.com:27415/conclavedb';
var redisUrl = 'redis://h:p1ffonaflhols5851ppbohsp2pv@ec2-54-221-194-20.compute-1.amazonaws.com:13669';
var redisuri = process.env.REDIS_URL || redisUrl;
var redis = require('redis')

module.exports = {
	
	isLoggedIn: function(req, res, next) 
	{
	  //console.log("inside isloggedin")
	  var client = redis.createClient(redisuri);
	  var sid = req.cookies[cookieKey]
	  var username ;
	  if(!sid)
	  {
	  	console.log("sid not found")
	  	return res.sendStatus(401)
	  }
	  else
	  {
		  username = client.hgetall(sid, function(err,userObj)
		  {
		  		//console.log("username = "+userObj)
				  if(userObj)
				  {
				  	//console.log(sid +' maps to '+userObj["username"])	
				  	req.username = userObj["username"]
				  	//console.log("inside isLoggedIn, username : "+userObj["username"])	
				  	client.quit();
				  	next()
				  	return;
				  }
				  else
				  {
				  	console.log("could not locate session")
				  	client.quit();
				  	res.sendStatus(401)
				  	return;
				  }
		  });
		  
	   }  	  
	},

	register: function(req, res)
	{
		var d = new Date();
		var salt = d.toUTCString(); 

		console.log("inside register")
		console.log(req.body.username+", "+req.body)
		console.log(req.cookies)

		mongodb.MongoClient.connect(uri, function(err, db){
			if(err)
			{
				console.log("unable to connect to db,"+err)
			  	res.sendStatus(401);
			  	throw err;
			  	return;
			}
			else
			{
				if(req.body.username!=null && req.body.password!=null)
				{
					var hash = md5(req.body.password+salt)
					var usersCollection = db.collection('users')
					usersCollection.insert({
						username: req.body.username,
						salt: salt,
						hash: hash
					})

					var usersRegisterCollection = db.collection('profiles')
					usersRegisterCollection.insert({
						username: req.body.username,
					    status: "temporary status",
					    following: [],
					    email: req.body.email,
					    zipcode: req.body.zipcode,
					    picture: "//www.gravatar.com/avatar/b9547066abc69c1d7332c9f28858a6b8?d=mm&s=100"   
					})
					console.log("user inserted into db,"+req.body.username+", "+req.body.password)
				}
				db.close;
			}
		})
		var msg = {result: 'success', username: req.body.username};
		console.log(msg)
		res.send(msg);
		
	},

	login: function(req, res)
	{
		console.log("inside login")
		var client = redis.createClient(redisuri);

		var userObj

			mongodb.MongoClient.connect(uri, function(err, db){
		  	if(err)
		  	{
		  		console.log("unable to connect to db,"+err)
		  		res.sendStatus(401);
		  		throw err;
		  		client.quit();
		  		return;
		  	}
			else
			{
			  	var usersCollection = db.collection('users')
			  	usersCollection.find({"username":req.body.username}).toArray(function(err, results){
					if(results.length>0)
					{
						userObj = results;
						//console.log( results[0].username)
						if(md5(req.body.password + userObj[0].salt)==userObj[0].hash) 
					 	{
					 		//console.log("login successs")
							var sessionKey = md5("a secret message" + new Date().getTime() + userObj[0].username)
							client.hmset(sessionKey, "username", userObj[0].username)
							//console.log("_sessionUser[sessionKey].username: "+_sessionUser[sessionKey].username+", sessionKey: "+sessionKey)
							res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true});
							console.log('cookie created successfully, '+sessionKey);
						    var msg = {username: results[0].username, result: 'success'};
						    //console.log(msg)
							res.send(msg);
							db.close;
							client.quit();
							return;
					 	}
					 	else
					 	{
					 		console.log("password wrong")
					 		res.sendStatus(401);
					 		db.close;
					 		client.quit();
					 		return;
					 	}
					}
					else 
					{
						console.log("no record found")
						res.sendStatus(401);
						db.close;
						client.quit();
						return;
					}
				},
				function()
				{
					console.log("db error")
					client.quit();
					db.close;
				});
	  		}
	    })
	},

	logout: function(req, res)
	{
		console.log("inside logout")
		var client = redis.createClient(redisuri);
		var sid = req.cookies[cookieKey];
		console.log("sid="+sid)
		if(!sid)
		{
			client.quit();
			res.clearCookie(cookieKey); 
			res.sendStatus(200);
		  	return
		}	    	

	    /*var status = client.exists(sid, function(err, reply) {
		    if (reply === 1) {
		        console.log('sid found exists');
		        return 1;
		    } else {
		        console.log('sid not doesn\'t exist');
		        return 0;
		    }
		});*/

			client.del(sid, function(err, reply) {
			    console.log(reply+", session deleted");
			});
			client.quit();
			res.clearCookie(cookieKey); 
			res.sendStatus(200);
			return;

	}
}