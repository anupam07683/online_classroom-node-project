var express = require('express');
var router = express.Router();
var multer = require('multer');
const path = require('path');

const register = require('./registerroutes');
const login = require('./loginroutes');
const loadData = require('./loadData');
const update = require('./updateData');
const showData = require('./showData');
const mail = require('./mailer');
const forgot = require('./forgotpassword');


const storage = multer.diskStorage({
  destination :function(req,file,cb){

    console.log(req.body)
    const type = req.body.contentType
    const subject = (req.body.course).replace(/\s/g,"_")
    cb(null,`./data/${type}/${subject}/`);
  },
  filename : function(req,file,cb){
    cb(null,file.originalname)
  }
});


const storageAssignment = multer.diskStorage({
  destination :function(req,file,cb){

    const subject = (req.body.course).replace(/\s/g,"_")
    cb(null,`./data/assignment_submitted/${subject}/`);
  },
  filename : function(req,file,cb){
    const userid = req.body.userid
    const subject = (req.body.course).replace(/\s/g,"_")
    const serial = req.body.serial
     
    cb(null,userid + '_' + subject + '_Assignment_ '+ serial + path.extname(file.originalname))
  }
});
 
const upload= multer({
  storage : storage,
  limits:{
  fileSize : 1024* 1024 * 10
  }
});
const submit = multer({
  storage : storageAssignment,
  limits:{
  fileSize : 1024* 1024 * 5
  }
})

/* GET index page. */
router.all('/', function(req, res, next) {
  if(!req.session.userid)
  return res.render('index', { data: 'Express' });
  else return res.redirect('/redirectToHome')
});

/* GET index*/ 
router.all('/index', function(req, res, next) {
  if(!req.session.userid)
  return res.render('index', { data: 'Express' });
  else return res.redirect('/redirectToHome')
});


/*GET homepage */
router.get('/home',function(req,res,next){
  if(req.session.userid)
  res.render('home',{ data: 'Express' })
  else
  res.redirect('/')
})

/*GET forgotpassword page */
router.get('/forgotpassword',function(req,res,next){
  res.render('forgotpassword',{ data: 'Express' })
})

/*GET resetpassword page */
router.all('/resetpassword',function(req,res,next){
  console.log(req.session.otp_submitted)
  if(req.session.otp_submitted)
  res.render('resetpassword',{ data: 'Express' })
  else
  res.redirect('/forgotpassword')
})
 
router.post('/login',login.login);
router.post('/registration',register.registration)

router.all('/logout',(request,response) => { 
  request.session.destroy();
  response.redirect('/')
  //response.render('forgotpassword',{data:'Express'});
})

router.post('/loadcourses', loadData.loadcourses);  //provides list of courses joined of created
router.post('/loadcoursedata', loadData.loadcoursedata); //load data of joined or created course
router.post('/addCourse',loadData.addCourse)           //add a new course for faculties only 
router.post('/getAllCourses',loadData.getAllCourses)  //provides the list od all the courses not created or joined
router.get('/getAllCourses',loadData.getAllCourses)    //provides the list od all the courses not created or joined
router.post('/joinCourse',loadData.joinCourse)            // joins a new course
router.post('/getCourseDetails',loadData.getCourseDetails) //show details of any course not joined
router.post('/addContent',upload.single('file'),update.addData) //used to add new assignment or notes
router.post('/submitAssignment',submit.single('file'),update.submitAssignment) //show submitted assignment files
router.post('/showSubmissionStudent',showData.showSubmissionStudent) //return list of submitted assignments
router.post('/mailer',mail.main)
router.post('/forgot',forgot.generate_otp)
router.post('/submitotp',forgot.submit_otp)
router.post('/reset',forgot.reset)



module.exports = router;
