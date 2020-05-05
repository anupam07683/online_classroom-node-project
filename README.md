# ONLINE CLASSES- (Project using Node.js) 

## **Introduction**
This is a basic and simple project developed using Node.js. A user can register either as a student or as a faculty both have different views. A student can join a course created by faculty and can download the assignment and notes of the corresponding course provided by the faculty also student can submit the solution to the assignments provided in the courses content <br> 
A faculty can create any new course and can add content to the course (assignments and notes). Assignments which are submitted by subscribers of the course will be available for the download for the download (scholar wise).<br>
Feature of forgot password is also available, someone who have forgotten his/her password can ask for forgot password. User can reset his/her password using a 6-digit OTP which will be provided in the registered email once he/she asked for forgot password, OTP is valid only for the next five minutes.

#### Technology used
* Html5
* CSS
* Javascript
* Node.js
* MySql

## **Setup** <hr>
>npm install && npm start

<br>

## **Tour to some features of this project** <hr>
#### *1. Login (authentication)*
![alt login](/public/screenshots/login.png)

<br>

#### *2. Registration for new user: user can either be a student or a faculty*
![alt registration](/public/screenshots/registration.png)

#### *3. Feature for joining a course available (This feature is only available for students)*
![alt 'details of a course not joned by student'](/public/screenshots/courses_not_joined.JPG)

<br>

#### *4. Details of a course (Assignments and notes provided by faculty). Student can submit the solution to the assignments provided by the faculty of the respective course*
![alt registration](/public/screenshots/joined_course_details.JPG)

<br>

#### *5. Feature for creating a new course only available for faculties*
![alt 'adding new course'](/public/screenshots/add_new_course.png)

<br>

#### *6. Faculty will get all the assignments submitted by all the subscribers of this particular course (scholar wise). Faculty can add new notes and assignments to the courses he/she has created*
![alt 'view of a faculty of created courses'](/public/screenshots/course_details_created.png)

<br>

#### *7. forgot password features implementes using opt sent to users registered email addresss using nodemailer*
![alt 'forgot password'](/public/screenshots/forgotpassword.png)

=== 