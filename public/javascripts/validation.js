function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const showalert = (cla,message) => {
  const alertbox = document.querySelector("#alertbox")
  alertbox.className += cla
  const p = document.querySelector("#alert_message")
  p.textContent = message
  alertbox.style.display = 'block'
}

const register_validation = () => {
  console.log('register validation called')
  const form = document.querySelector("#registrationform")
  const pattern_firstname = /[a-zA-Z]+/g
  const pattern_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  const pattern_scholar = /^[0-9]{9}$/
  const pattern_semester = /^[1-8]$/


  if(!form.first_name.value || !pattern_firstname.test(form.first_name.value)){
    showalert('alert-danger','please fill the first name correctly')
    topFunction()
    return false
  }
  if(!form.gender.value)
  {
    showalert('alert-danger','please select the gender')
    topFunction()
    return false
  }
  if(!form.email.value || !pattern_email.test(form.email.value))
  {
    showalert('alert-danger','please enter the correct email')
    topFunction()
    return false
  }
  if(!form.role.value)
  {
    showalert('alert-danger','please select a role')
    topFunction()
    return false
  }
  if(form.role.value == 'student' && !pattern_scholar.test(form.scholar.value))
  {
    showalert('alert-danger','enter a valid sholar no')
    topFunction()
    return false
  }
  if(!form.semester.value || !pattern_semester.test(form.semester.value))
  {
    showalert('alert-danger','please enter the correct semester')
    topFunction()
    return false
  }
  return true
}


const login_validation = () => {
  const pattern_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  const form = document.querySelector("#loginform")

  if(!form.email.value || !pattern_email.test(form.email.value))
  {
    showalert('alert-danger','please enter a valid email')
    topFunction()
    return false
  }
  if(!form.password.value )
  {
    showalert('alert-danger','please enter password')
    topFunction()
    return false
  }
  return true;
}