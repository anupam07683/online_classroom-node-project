const bcrypt = require('bcrypt');
const registerModel = require('../model/registerModel')
const register_validation = (req) => {
  const pattern_firstname = /[a-zA-Z]+/g
  const pattern_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  const pattern_scholar = /^[0-9]{9}$/
  const pattern_semester = /^[1-8]$/

  if(!req.body.first_name  || !pattern_firstname.test(req.body.first_name)){
    return false
  }
  if(!req.body.gender)
  {
    return false
  }
  if(!req.body.email || !pattern_email.test(req.body.email))
  {
    return false
  }
  if(!req.body.email)
  {
    return false
  }
  if(req.body.role == 'student' && !pattern_scholar.test(req.body.scholar))
  {
    return false
  }
  if(req.body.role == 'student' &&  !pattern_semester.test(req.body.semester))
  {
    return false
  }
  if(!req.body.password)
  return false
  return true
}

exports.registration = (request,response) => {
  const validate = register_validation(request)
  if(validate == false)
  {
    return response.render('index','Registration can not be completed wrong details !!! try again')
  }
  registerModel.register(request,(error,result) => {
    console.log(error,result)
    if(error)
    {
      return response.render('index',{data : {class:"alert-danger", message:'Error Occured,try again later'}})
    }
    else{
      request.session.userid = request.body.email;
      request.session.usertype = request.body.role;
      return response.redirect('/home' );
    }
  }) 
} 