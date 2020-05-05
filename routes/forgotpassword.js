const mysql = require('mysql');
const mail = require('../routes/mailer');

const getModel = require('../model/getModel');
const updateModel = require('../model/updateModel');


DB_DETAILS = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}

/*
This function send a 6 digit otp to the email id that request for forgotpassword 
by using the mailer module 
*/
exports.generate_otp = (request,response) => {
  getModel.getemail(request,(error,result) => {
    if( error )
    {
      return response.render('forgotpassword',{data: { class: "alert-danger", message: "email does not exits" } })
    }if(result.length > 0){
      request.session.forgot = request.body.email;
      const re = mail.main(request,response).then(
        () => {
          return response.render('forgotpassword',{data: { class: "alert-success", message: "email sent to your registered email account" } })
        }
      );
    }
    else {
      return response.render('forgotpassword',{data: { class: "alert-danger", message: "register first" } })
    }
  })
}

/*
This function recieves an otp in the request object and confirm if otp is correct or not 
are render view based on comparision results
*/
exports.submit_otp = (request,response) => {
  if(request.session.forgot)
  {
     
    const time = Date.now() ;
    getModel.getotp(request,(error,result) => {
      if(error)
      {
        console.log(error);
        return response.render('forgotpassword',{data:{class:"alert-danger" ,message:'query error!! something went wrong'}});
      }
      else {
        if(result[0].otp == request.body.otp && result[0].time >= time)
        {
          console.log(result,result[0].time,time);
          request.session.otp_submitted = "true";
          return  response.redirect("/resetpassword");
          
        }
        else {
          console.log(result,time);
          return response.redirect("/forgotpassword");
        }
      }
    })
  }
  else
  {
    console.log('conflict')
    return response.render('forgotpassword',{data:{class:"alert-danger" ,message:'get your otp first'}})
  }
  
}

/*
This function is finally called to reset the password if both password matched the only password is set 
otherwise error message will we shown to use user
*/
exports.reset = (request,response) => {
  if(request.session.forgot && request.session.otp_submitted)
  {
    const pwd = request.body.password
    const cnf_pwd = request.body.confirm_password
    if(pwd && cnf_pwd && pwd != cnf_pwd){
      return response.render('resetpassword',{data:{class:"alert-danger" ,message:'password does not match'}})
    }
    
    updateModel.updatepassword(request,(error,result)=>{
      if(error)
      {
        return response.render('resetpassword',{data:{class:"alert-danger" ,message:'error !! try again later'}})
      }
      else{   
        return response.render('index',{data:{class:"alert-success" ,message:'password updated successfully now login'}})
      }
    })
  }
  else
  return response.render('forgotpassword',{data:{class:"alert-success" ,message:'redirected from reset'}})
}