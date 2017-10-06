var express = require('express'),
  router = express.Router(),
  watson = require('watson-developer-cloud');
  
  var authorization = watson.authorization({
username: "7d57965d-d0ad-4e0c-b462-c116c02f7f2c",
  password: "5kelDavNsqbY",
  version: 'v1'
  });

  var params = {
  // URL of the resource you wish to access
  url: 'https://stream.watsonplatform.net/text-to-speech/api'
  };

router.get('/token', function(req, res) {
	authorization.getToken(params, function (err, token) {
  		if (err) {
    		console.log('Error retrieving token: ', err);
      		res.status(500).send('Error retrieving token');
      		return;
  		}
	  	else
  		{
  			console.log("Inside tts-token.js. Token - ", token);
  			res.send(token);
  		}
  		});
});
  
module.exports = router;