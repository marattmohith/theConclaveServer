var posts = require('./samplePosts.json')
var mongodb = require('mongodb');
var md5 = require('md5')
var uri = 'mongodb://marattmohith:conclave@ds027415.mongolab.com:27415/conclavedb';

module.exports = {
	
	putStatus: function(req, res) {
		console.log("inside putStatus")
		mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
	  			console.log("status:"+req.body.status)
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.update({"username": req.username}, {$set:{"status":req.body.status}},
			  		function(err, results){
				    //console.log(results)
				   res.json
				    ({
				    	username: req.username,
				  		status: req.body.status
				  	});
				})
				db.close;
	  		}
	    })
	  
	},

	getStatus: function(req, res)
	{
		console.log(" ")
		console.log("inside getStatus")
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.find({"username": req.username}).toArray(function(err, results){
				    console.log("status: "+results)
				    try{
					    res.json
					    ({
					    	username: req.username,
					  		status: results[0].status
					  	});
					}
					catch(e)
					{
						res.json
					    ({
					    	username: req.username,
					  		status: "temporary status"
					  	});
					}
				});
			  	db.close;
	  		}
	    })
	},

	getEmail: function(req, res)
	{
		console.log(" ")
		console.log("inside getEmail of "+req.params.user)
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.find({"username": req.params.user},{"email":1, _id: 0}).toArray(function(err, results){
				    console.log("email: "+results[0].email)
				    res.json
				    ({
				    	username: req.params.user,
				  		email: results[0].email
				  	});
				});
			  	db.close;
	  		}
	    })
	},

	putEmail: function(req, res)
	{
		console.log(" ")
		console.log("inside putEmail")
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	console.log("putEmail:"+req.body.email)
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.update({"username": req.username}, {$set:{"email":req.body.email}},
			  		function(err, results){
				    //console.log(results)
				   res.json
				    ({
				    	username: req.username,
				  		email: req.body.email
				  	});
				   })
			  	db.close;
	  		}
	    })
	},
	putPicture: function(req, res)
	{
		console.log(" ")
		console.log("inside putPicture")
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	console.log("putPicture:"+req.body.picture)
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.update({"username": req.username}, {$set:{"picture":req.body.picture}},
			  		function(err, results){
				    //console.log(results)
				   res.json
				    ({
				    	username: req.username,
				  		picture: req.body.picture
				  	});
				   })
			  	db.close;
	  		}
	    })
	},
	getPicture: function(req, res)
	{
		console.log(" ")
		console.log("inside getPicture of "+req.params.user)
		mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.find({"username": req.params.user}).toArray(function(err, results){
				    console.log("email: "+results[0].picture)
				    res.json
				    ({
				    	username: req.username,
				  		picture: results[0].picture
				  	});
				});
	  		}
	  		db.close;
	    })
	},

	putPassword: function(req, res)
	{
		console.log(" ")
		console.log("inside putPassword")
		var d = new Date();
		var salt = d.toUTCString(); 

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
				if(req.body.password!=null)
				{
					var hash = md5(req.body.password+salt)
					var usersCollection = db.collection('users')
					usersCollection.update({"username": req.username}, {$set:{"salt":salt, "hash":hash}},
				  		function(err, results){
						   res.json
						    ({
						    	username: req.username,
						  		status: 'will not change'
						  	});
				   		})

					//console.log("user password updated into db,"+req.body.password)
				}
				db.close;
			}
		})
	},
	putZipcode: function(req, res)
	{
		console.log(" ")
		console.log("inside putZipcode")
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	console.log("putZipcode:"+req.body.zipcode)
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.update({"username": req.username}, {$set:{"zipcode":req.body.zipcode}},
			  		function(err, results){
				    //console.log(results)
				   res.json
				    ({
				    	username: req.username,
				  		zipcode: req.body.zipcode
				  	});
				   })
	  		}
	  		db.close;
	    })
	},

	getZipcode: function(req, res)
	{
		console.log(" ")
		console.log("inside getZipcode of "+req.params.user)
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.find({"username": req.params.user}).toArray(function(err, results){
				    console.log("email: "+results[0].zipcode)
				    res.json
				    ({
				    	username: req.username,
				  		zipcode: results[0].zipcode
				  	});
				});
	  		}
	  		db.close;
	    })
	},

	addPost: function(req, res) {
		console.log("inside addPost")
	    console.log('Payload received', req.body)
		posts.push(
			{
				"id": posts.length,
				"author": req.username,
				"body": "my "+posts.length+" post",
				"date": (new Date()).toJSON(),
				"comments": []
			}
			)
		    res.send(posts[posts.length-1]
		)
	},

	hello: function(req, res) {
		console.log(req.cookies)
	    res.send('Hello World!')
	},

	helloUser: function(req, res) {
	    res.send('Hello '+req.params.user+" !")
	},

	getPost: function(req,res)
	{
		var myPosts;
		var followersPosts = "";
		var profileDetails;
		console.log("inside getPost = "+req.username)
		mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	var postsCollection = db.collection('posts')
			  	postsCollection.find({"author": req.username}).limit(10).toArray(function(err, results){

				    //console.log(results)
					res.json
					    ({
					  		posts: results

					  	});
				  	db.close;
				});
	  		}
	  })
	},

	samplePosts: function(req,res)
	{
	  console.log("inside samplePosts")
	  mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	var samplePostsCollection = db.collection('samplePosts')
			  	samplePostsCollection.find({}).toArray(function(err, results){
				    res.json
				    ({
				  		posts: results
				  	});
				});
			  	db.close;
	  		}
	  })	  
	},

	getPostOfID: function(req, res)
	{
	  console.log("inside getPostOfID")
		for(var i = 0; i < posts.length; i++)
			if(req.params.id==posts[i].id)
				res.send(posts[i]);
		
		res.send("");
	},

	getFollowing: function(req, res)
	{
		console.log(" ")
		console.log("inside get following for "+req.params.user+", "+ typeof req.params.user)
		var followers;
	  	mongodb.MongoClient.connect(uri, function(err,  db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.find({"username": req.params.user}).toArray(function(err, results){
				    //console.log(results)
				    res.json
				    ({
				    	username: req.params.user,
				  		following: results[0].following

				  	});
				});
			  	db.close;
	  		}
	    })
	},

	putFollowing: function(req, res)
	{
		console.log(" ")
		console.log("inside putFollowing")
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	//console.log("status:"+req.body.email)
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.update({"username": req.username}, {$push:{following:req.param.user}},
			  		function(err, results){
				    console.log("putfollowing after resutl: "+results)
				   res.json
				    ({
				    	username: req.username,
				  		following: results[0].following
				  	});
				   })
			  	db.close;
	  		}
	    })
	},
	deleteFollowing: function(req, res)
	{
		console.log(" ")
		console.log("inside deleteFollowing")
	  	mongodb.MongoClient.connect(uri, function(err, db){
	  		if(err)
	  		{
	  			console.log("unable to connect to db,"+err)
	  			throw err;
	  		}
	  		else
	  		{
			  	//console.log("status:"+req.body.email)
			  	var profileCollection = db.collection('profiles')
			  	profileCollection.update({"username": req.username}, {$pull:{following: req.param.user}},
			  		function(err, results){
				    console.log("putfollowing after resutl: "+results)
				   res.json
				    ({
				    	username: req.username,
				  		following: results[0].following
				  	});
				   })
			  	db.close;
	  		}
	    })
	}

}