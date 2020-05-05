const bcrypt = require('bcrypt');
const getModel = require('../model/getModel');

const validateLoginDetails = (req) => {
  // console.log(req.body.username,req.body.password)
  const pattern_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  
  if(!req.body.username || !req.body.password || !pattern_email.test(req.body.username))
  {
    return false
  }
  return true
}

exports.login = function(req,res){
  let validate = validateLoginDetails(req)
  if(validate == false)
  {
    return  res.render('index',{data : {class:"alert-danger", message:'Incorrect Credentials'}})
  }
  const email= req.body.username
  const password = req.body.password
  getModel.getuserDetails(req,(err,result) => {
    console.log(err,result)
    if(err)
    {
      console.log("eror received",err)
      return res.render('index',{data : {class:"alert-danger", message:'try again later'}})
    }
    else{
      console.log("result",result)
      if(result.length > 0 && bcrypt.compareSync(password,result[0].PASSWORD))
      {
        console.log(bcrypt.compareSync('comparing passwords',password,result[0].PASSWORD))
        req.session.userid = email
        req.session.usertype = result[0].ROLE
        return res.redirect('/home')
      }
      else{
        console.log("password miss match",err)
        return res.render('index',{data : {class:"alert-danger", message:'no account with this email'}});
      }
    }
  }) 
}; 