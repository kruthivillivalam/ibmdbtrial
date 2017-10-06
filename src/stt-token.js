var express = require('express'),
  router = express.Router(),
  watson = require('watson-developer-cloud');

  var authorization = watson.authorization({
  username: "e37ea50f-ae39-4e49-ac68-2f48a192eac3",
  password: "nD3EOeE4Eenz",
  customization_id : "03d75480-6c4b-11e7-85f6-435b156592c7",
  version: 'v1'
  });


    var authorization1 = watson.authorization({
  username: "e37ea50f-ae39-4e49-ac68-2f48a192eac3",
  password: "nD3EOeE4Eenz",
  customization_id : "e082e4a0-8c01-11e7-9b0f-69059719c06b",
  version: 'v1'
  });

  var params = {
  // URL of the resource you wish to access
  url: 'https://stream.watsonplatform.net/speech-to-text/api'
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
  			console.log("Inside stt-token.js. Token - ", token);
  			res.send(token);
  		}
  		});
});


  router.get('/token1', function(req, res) {
	authorization1.getToken(params, function (err, token) {
  		if (err) {
    		console.log('Error retrieving token: ', err);
      		res.status(500).send('Error retrieving token');
      		return;
  		}
	  	else
  		{
  			console.log("Inside stt-token.js. Token - ", token);
  			res.send(token);
  		}
  		});
});
module.exports = router;
