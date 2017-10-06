  const express = require("express");
  const app = express();
  var bodyParser = require('body-parser');
  var nodemailer = require('nodemailer');
  app.use(bodyParser.urlencoded());
  const path = require("path");
  app.use(bodyParser());
  app.use(bodyParser.json());
  app.set("json spaces", 2);
  app.set("json replacer", null);
  app.set("views", "./public");
  app.set("view engine", "jade");

  var email=require('./email');

  var ibmdb = require('ibm_db');
  //var ibmdb ='';
  // Start : Connection for Japanese Database
  var db2 = {
          db: "BLUDB",
          hostname: "dashdb-entry-yp-dal09-08.services.dal.bluemix.net",
          port: 50000,
          username: "dash11029",
          password: "x_B1ErG_4mnI"// "jMvGc@3~D0Mq"
       };
  var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;
  /**bodyParser.json(options)
   * Parses the text as JSON and exposes the resulting object on req.body.
   */
   //End : Connection for Japanese Database

  const Conversation = require("watson-developer-cloud/conversation/v1");
  const classifier = new Conversation({
    username: "842921ad-edff-4f0e-a311-4a9a9e8c75d2",
    password: "DaZjpF4fUI7h",
    version: "v1",
    version_date: "2017-05-26"
  });
  // Render the index.html
    app.get( "/", function( req, res ) {
      res.sendFile(path.join( __dirname, "public", "chatbox.html"));
      });

  /**
   * Classify text
   */
	  app.post("/classify", (req, res) => {
  //req.body.responseContext.length = 0;
  		console.log("*************** Received 1 " + req.url);
  		console.log('Chat Language: '+ req.body.chatLang );
  		console.log('responseContext*************' +req.body.responseContext )
  		console.log('body: '+ req.body.responseContext.length );
  		if(req.body.responseContext.length !=0 && req.body.chatLang == 'JP' )
  			{
  				console.log("*************** Received if JP");
  				classifier.message(
  						{
  							workspace_id: "1e8e9ad8-f1a4-4451-a077-d0ef1917dee3",
  							input: {'text': req.body.title},
  							context : req.body.responseContext
  						},
  						function (err, data) {
  							if (err)
  							{
  								console.log("*************** Received ERRRRRRRRRRRRRR");
  								return next(err);
  							}
  							else
  							{
  								console.log("*************** Received 6 "+ JSON.stringify(data));
  								res.send(JSON.stringify(data));
  							}
  						}
  				);
  			}
		  else if( req.body.responseContext.length ==0 && req.body.chatLang == 'JP')
  			{
  				console.log("*************** Received else JP");
  				classifier.message(
  						{
  							workspace_id: "1e8e9ad8-f1a4-4451-a077-d0ef1917dee3",
  							input: {'text': req.body.title},
  						},
  						function (err, data) {
  							if (err)
  							{
  								console.log("*************** Received ERRRRRRRRRRRRRR");
  								return next(err);
  							}
  							else
  							{
  								console.log("*************** Received 6 "+ JSON.stringify(data));
  								res.send(JSON.stringify(data));
  							}
  						}

  				);
  			}
        else if(req.body.responseContext.length !=0 && req.body.chatLang=='EN' )
        {
          console.log("*************** Received if EN");
          classifier.message(
              {
                workspace_id: "aa33294e-a896-4518-84ab-15b9da830e6e",
                input: {'text': req.body.title},
                context : req.body.responseContext
              },
              function (err, data) {
                if (err)
                {
                  console.log("*************** Received ERRRRRRRRRRRRRR");
                  return next(err);
                }
                else
                {
                  console.log("*************** Received 6 "+ JSON.stringify(data));
                  res.send(JSON.stringify(data));
                }
              }
          );
        }


        else if (req.body.responseContext.length ==0 && req.body.chatLang == 'EN')
  			{
  				console.log("*************** Received else EN");
  				classifier.message(
  						{
  							workspace_id: "aa33294e-a896-4518-84ab-15b9da830e6e",
  							input: {'text': req.body.title},
  						},
  						function (err, data) {
  							if (err)
  							{
  								console.log("*************** Received ERRRRRRRRRRRRRR");
  								return next(err);
  							}
  							else
  							{
  								console.log("*************** Received 6 "+ JSON.stringify(data));
  								res.send(JSON.stringify(data));
  							}
  						}

  				);
  			}
      });

  	//Validating policy provided by user //
  	//***********************************//
  	app.post("/fetchactivities", (req, res1) => {
      console.log("***************entering into fetch Activities");
  	//Opening the connection //
  		var response ="";
      ibmdb.open(connString, function(err, conn)
      {
          if(err){
            	console.error("error: ", err.message);
           }
          else {
            console.log("*************** Started "+ req.body.fetchQuery);
  		//Firing the query for fetching policy on basis of users input//
  		 //   console.log("Policy No. by user" + req.body.policyNo);
            conn.query(req.body.fetchQuery, function(err, activities, moreResultSets) {
  		          if(activities.length == 0){
  						          console.log('length is 0');
                        res1.send(activities);
  				       }
  			        else{
  						          console.log("Else when length not 0 : " + JSON.stringify(activities));
  					            res1.send(activities);
  					     }
             });
          }
       });
  });

  	//.................

      	//Validating policy provided by user //
  	//***********************************//

  	app.post("/fetchphasedetail", (req, res1) => {
      console.log("***************entering into fetch phase details");
  	//Opening the connection //
  		var response ="";
  		ibmdb.open(connString, function(err, conn)
  		{
  			if(err){
  				console.error("error: ", err.message);
  			}
  			else{
  				console.log("*************** Started**"+req.body.fetchQuery);
  		//Firing the query for fetching policy on basis of users input//
  		 //   console.log("Policy No. by user" + req.body.policyNo);
  					conn.query(req.body.fetchQuery, function(err, activities, moreResultSets) {
  					console.log("activities :" + JSON.stringify(activities));
  					res1.send(activities);
  			     });
         }
      });
  	});

  	//  //Start Inserting Claim pon details provided by user //
  	//***********************************//

  	app.post("/updatestatus", (req, res1) => {
  		console.log("***************entering into update status");
  		//Opening the connection //
  		var response ="";
  			ibmdb.open(connString, function(err, conn)
  				{
  					if(err){
  						console.error("error: ", err.message);
  					}
  					else{
  						console.log("*************** Started11 "+req.body.fetchQuery);
  						conn.query(req.body.fetchQuery, function(err, policies1, moreResultSets) {
  							if(err){
  								console.error("error: ", err.message);
  							}
  							else{
  								console.log("Data has been updated");
  								z =[{'text':'ステータスの更新に成功しました。'}]
  								res1.send(z);
  							}
  						});
  					}
  				});
  	});
      //End Inserting Claim pon details provided by user

    //Start Email -Discovery Section
    app.post("/discovery1", (req, res1) => {
    message=JSON.stringify(req.body.input.text);
        console.log('This is the message:' +JSON.stringify(req.body.input.text));
        var mailOptions = {
        from: 'codingninja93@gmail.com',
        to: 'satya.iter2012@gmail.com',
        subject: 'Query',
        text: message
     };
    var response=email(mailOptions,res1);
  });
    //End Email -Discovery Section

   //Start Discovery Section
  var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
    var discovery = new DiscoveryV1({
        username: "11f33ada-805b-4bed-9621-cd58fd0a09ac",
        password: "yU82CCX3iw0E",
        version_date: "2017-08-01"
    });
    app.post("/discovery", (req, res1) => {
          console.log("inside /discovery "+req.body.input.text);
          var inputChat=req.body.input.text;
          var inputQuery = inputChat.replace(/[&\/\\#,+()$~%.'":*<>{}]/g, '');
          console.log("inputQuery: ",inputQuery);
          discovery.query({
              environment_id: 'bcd3aea8-0799-4404-bb31-433cd08a3401',
              collection_id : '88c2b2e3-b9c1-4632-8b79-567b587439de',
              "count": 1,
              "return" : "text",
              "query":inputQuery
            }, function(err, data) {
              if (err) {
                console.error("*************** Received ERRRRRRRRRRRRRR::"+err);
             }
             else {
              console.log(JSON.stringify(data, null, 2));
              res1.send(JSON.stringify(data));
             }
          });
        });
    //End Discovery Section

    var LanguageTranslationV2 = require('watson-developer-cloud/language-translation/v2')
    var language_translator = new LanguageTranslationV2({
      "username": "860c66f2-391b-4962-8c97-d240a95ded17",
      "password": "PmWXiwsrhMvn",
    version: 'v2',
    url: 'https://gateway.watsonplatform.net/language-translator/api/'
    });
  app.post('/translate',	function(req,res,body)
  {
     var text= req.body.input.text;
      language_translator.identify({ text },

    function( err,identifiedLanguages) {
       if (err)
        console.log(err)
      else
      {
      if(identifiedLanguages.languages[0].language =='ja')
      {
      language_translator.translate({
      text: text,
      source: 'ja',
      target: 'en'
    }, function(err, translation)
    {
    console.log(translation);
    console.log(translation.translations[0].translation);
    console.log('translated');

	var inputChat=translation.translations[0].translation;
    discovery.query({
    environment_id: 'bcd3aea8-0799-4404-bb31-433cd08a3401',
    collection_id : '88c2b2e3-b9c1-4632-8b79-567b587439de',
            "count": 1,
            "return" : "text",
            "query":inputChat.replace(/[&\/\\#,+()$~%.'":*<>{}]/g, '')
        }, function(err, data) {
             if (err) {
               console.log(err);
                         console.error("*************** Received ERRRRRRRRRRRRRR");
                         }
             else
             {
            console.log(JSON.stringify(data, null, 2));
            res.send(JSON.stringify(data));
             }
          });
    });
      }
      else
       {
      language_translator.translate({
      text: text,
      source: 'en',
      target: 'ja'
    }, function(err, translation)
    {
    console.log(translation);
    console.log(translation.translations[0].translation);
    res.send(translation.translations[0].translation);
    });
      }
    }
    });
    });

    app.post('/translate1',	function(req,res,body)

    {
     var text= req.body.reply;
      language_translator.identify({ text },


    function( err,identifiedLanguages) {
       if (err)
        console.log(err)
      else
      {

      if(identifiedLanguages.languages[0].language =='en')
      {
      language_translator.translate({
      text: text,
      source: 'en',
      target: 'ja'

    }, function(err, translation)
    {
    console.log(translation);
    console.log(translation.translations[0].translation);
    res.send(translation);
    console.log('translated');
     });
      }
      else
       {
      language_translator.translate({
      text: text,
      source: 'ja',
      target: 'en'
    }, function(err, translation)

      {
    console.log(translation.translations[0].translation);
    res.send(translation);
    });
      }
    }
    });
    });
    //End Translate function

    app.use('/api/speech-to-text/', require('./stt-token.js'));
    app.use('/api/text-to-speech/', require('./tts-token.js'));
    module.exports = app;
