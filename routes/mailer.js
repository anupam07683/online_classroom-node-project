const nodemailer = require('nodemailer')
const mysql      = require('mysql')

const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}


//function to generate a 6- digit random number for the purpose of otp
function random() {
  return Math.floor(Math.random() * (999999 - 100000)) + 100000
}

// async..await is not allowed in global scope, must use a wrapper
async function main(response,email) {
  console.log("mailer called")
  let smtpTransporter = nodemailer.createTransport({
    service :"gmail", 
    auth: {
      user:  process.env.EMAIL, // generated ethereal user
      pass:  process.env.PASSWORD // generated ethereal password
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
        const connection = mysql.createConnection(db_details)
        connection.connect((error) => {
          if(error)
          console.log(error)
        })
        
        const time = Date.now()+5*60*1000
        let query = "insert into resetpassword values(?,?,?) on duplicate key update otp = ?, time = ?"
        connection.query(query,[email,otp,time,otp,time],(error,result) => {
          if(error)
          {
            console.log(error)
            return 
          }
          else{
            console.log("inserted")
            return
          } 
        })
      }
      
    })

  
}


module.exports.main = main;