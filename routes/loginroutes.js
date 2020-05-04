const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}

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
  console.log(db_details)
  if(validate == false)
  {
    return  res.render('index',{data : {class:"alert-danger", message:'Incorrect Credentials'}})
  }
  console.log(validate);

  const email= req.body.username;
  const password = req.body.password;

  
  var connection = mysql.createConnection(db_details); 
  connection.connect(function(err){
  if(!err) { 
      console.log("Database is connected ... nn");
      return connection;
  } else {
      console.log("database connection error");
      return res.render('index',{data : {class:"alert-danger", message:'database error try again later'}})
  }
  });

  connection.query('SELECT * FROM user WHERE EMAIL = ?',[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    return res.render('index',{data : {class:"alert-danger", message:'try again later'}}) 
  }else{
    if(results.length >0){
      console.log("comparing passwords",bcrypt.compareSync(password, results[0].PASSWORD));
      if(bcrypt.compareSync(password, results[0].PASSWORD)){
        req.session.userid = email
        req.session.usertype = results[0].ROLE
        return res.redirect('/home')
      }
      else{       
        return res.render('index',{data : {class:"alert-danger", message:'wrong password'}})
      }
    }
    else{
      return res.render('index',{data : {class:"alert-danger", message:'no account with this email'}});
    }
  }
  });
};
/*
exports.facultyLogin = function(req,res){
  const email= req.body.username
  const password = req.body.password

  req.session.userid = email
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

  connection.query('SELECT * FROM faculty WHERE EMAIL = ?',[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      if(results[0].PASSWORD == password){
      res.redirect('home')
      //  res.send({
      //     "code":200,
      //     "success":"login sucessfull"
      //       });
      }
      else{
        
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });
}


exports.studentLogin = function(req,res){
  
  const scholar= req.body.username;
  const password = req.body.password;

  req.session.userid = scholar
  req.session.usertype = 'student'

  //creating mysql connection
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

  connection.query('SELECT * FROM student WHERE SCHOLAR = ?',[scholar], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      if(results[0].PASSWORD == password){
        res.redirect('home')
        // res.send({
        //   "code":200,
        //   "success":"login sucessfull"
        //     });   
      }
      else{
        console.log(results)
        res.send({
          "code":204,
          "success":"scholar  and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"scholar does not exits"
          });
    }
  }
  });
}
*/