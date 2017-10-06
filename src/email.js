var nodemailer = require('nodemailer');
module.exports=function( mailOptions,res )
{
  var reply;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: 'codingninja93@gmail.com',
          pass: 'codingninja12345'
        }
      });
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        }
        else {
            console.log('Email sent: ');
          reply =[{'text':'Anything else?'}];
          res.send(reply);
        }
      });
}
