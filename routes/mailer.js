const nodemailer = require('nodemailer')
const updateModel = require('../model/updateModel')

 
//function to generate a 6- digit random number for the purpose of otp
function random() {
  return Math.floor(Math.random() * (999999 - 100000)) + 100000
}

// async..await is not allowed in global scope, must use a wrapper
async function main(request,response) {
  const email = request.body.email
  console.log("mailer called")
  let smtpTransporter = nodemailer.createTransport({
    service :"gmail", 
    auth: {
      user:  process.env.EMAIL,  
      pass:  process.env.PASSWORD 
    },
    tls:{
      rejectUnauthorized:false
    }
  });
    const otp = random()
    var mailOptions = {
      from: process.env.EMAIL,
      to : email,
      subject : 'forgot password online account',
      text : 'to reset your password for online classes in ' + otp + "  valid for next five minutes"
    };
    await smtpTransporter.sendMail(mailOptions,function(err,info){
      if(err)
      {
        console.log(err)
        return response.render('forgotpassword',{data : { class:'alert-danger', message:err}})
      }
      else{
        updateModel.updateotp(request,otp,(error,result) => {
          if(error)
          {
            console.log(error)
            return false;
          }
          else{
            console.log("inserted")
            return true;
          } 
        })
      }
      
    })

  
}


module.exports.main = main;