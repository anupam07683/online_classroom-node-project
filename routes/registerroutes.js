var mysql = require('mysql');
const bcrypt = require('bcrypt');
let dbDetails = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}

const register_validation = (req) => {
  const pattern_firstname = /[a-zA-Z]+/g
  const pattern_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  const pattern_scholar = /^[0-9]{9}$/
  const pattern_semester = /^[1-8]$/

  if(!req.body.first_name  || !pattern_firstname.test(req.body.first_name)){
    console.log("first name")
    return false
  }
  if(!req.body.gender)
  {
    console.log("gender")
    return false
  }
  if(!req.body.email || !pattern_email.test(req.body.email))
  {
    console.log("email")
    return false
  }
  if(req.body.role == 'student' && !pattern_scholar.test(req.body.scholar))
  {
    
    console.log("scholar",req.body.scholar.toString())
    return false
  }
  if(req.body.role == 'student' &&  !pattern_semester.test(req.body.semester))
  {
    console.log("semester")
    return false
  }
  if(!req.body.password)
  {
    console.log("password")
    return false
  }
  return true
}



const createHash = (password) => {
  return  bcrypt.hashSync(password,10);
} 
exports.registration = (request,response) => {
   
  const validate = register_validation(request)
  console.log(validate)
  if(validate == false)
  {
    return response.render('index',{data : 'Registration can not be completed wrong details !!! try again'})
  }
  var details
  let today = new Date()
  let password =  createHash(request.body.password);
  console.log(password)
  if(request.body.role == 'student')
  {
    details = {
      "email"      : request.body.email,
      "Scholar"    : request.body.scholar,
      "first_name" : request.body.first_name,
      "last_name"  : request.body.last_name,
      "semester"   : request.body.semester,
      "department" : request.body.department,
      "gender"     : request.body.gender, 
      "password"   : password,
      "role"       : "student",
      "created"    : today,
      "modified"   : today
    }
  }
  if(request.body.role == 'faculty')
  {
    details = {
      "email"      : request.body.email,
      "first_name" : request.body.first_name,
      "last_name"  : request.body.last_name,
      "department" : request.body.department,
      "gender"     : request.body.gender, 
      "password"   : password,
      "role"       : "faculty",
      "created"    : today,
      "modified"   : today
    }
  }
  let connection = mysql.createConnection(dbDetails)
  connection.connect((error) => {
    if(error)
    {
      return response.render('index',{data : {class:"alert-danger", message:'Error Occured,try again later'}})
    }
  })

   connection.query("insert into user set ?",[details],(error,result) => {
    if(error)
    {
      console.log("details",details)
      console.log(error.message)
       return response.render('index',{data : {class:"alert-danger", message:'Error Occured !! try again'}})
    }
    else {
      request.session.userid = request.body.email
      request.session.usertype = request.body.role
      return response.redirect('/home' )
    }
  })
  
}
/*
exports.facultyRegister = function(req,res){
  var today = new Date();
  var faculties={
    "email":req.body.email,
    "scholar" :null,
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "semester" : null,
    "department":req.body.department,
    "gender":req.body.gender,
    "password":req.body.password,
    "role" : "faculty",
    "created":today,
    "modified":today
  }
  req.session.userid = req.body.email
  req.session.usertype = 'faculty'
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'anupam',
    database : 'college'
  });
  
  connection.connect(function(err){
  if(!err) {
  
      console.log("Database is connected ... nn");
      return connection;
  } else {
      console.log("database connection error");
      res.send({"code":400,"failed":"database connection error"})
  }
  });
 
  connection.query('INSERT INTO user SET ?',faculties, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    res.redirect('home')
    // res.send({
    //   "code":200,
    //   "success":"user registered sucessfully"
    //     });
  }
  });
}


exports.studentRegister = function(req,res){
  console.log("req",req.body);
  const today = new Date();
  var students={
    "email" : req.body.email,
    "scholar":req.body.scholar,
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "semester":req.body.semester,
    "department" : req.body.branch,
    "gender":req.body.gender,
    "password":req.body.password, 
    "role" : "student", 
    "created":today,
    "modified":today
  }
  req.session.userid = req.body.email
  req.session.usertype = 'student'

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'anupam',
    database : 'college'
  });

  connection.connect(function(err){
      if(!err)
      {
        console.log("Database Connected!!");
      }else{
        res.send({"code":400,"failed":"database connection error"})
      }
  });

  connection.query('INSERT INTO user SET ?',students, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":error
    })
  }else{
    res.redirect('home')
    // res.send({
    //   "code":200,
    //   "success":"user registered sucessfully"
    //     });
  }
  });
}
*/