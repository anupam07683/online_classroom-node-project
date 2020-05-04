//to scroll to the top of thepage 
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
const validateForgotEmail = () => {
  const pattern_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  const form = document.querySelector("#forgotEmailForm")
  console.log("vlidateforgotemail called")
  if(!form.email || !pattern_email.test(form.email.value))
  {
    showalert("alert-danger","please enter a valid email address")
    topFunction()
    return false
  }
  return true
}

const validateOTP = () => {
  const  pattern_otp = /^[0-9]{6}$/
  const form = document.querySelector("#forgotOtpForm")
  if(!form.otp || !pattern_otp.test(form.otp.value))
  {
    showalert("alert-danger","please a six digit secret code")
    topFunction()
    return false
  }
  return true
}

const validateResetPassword = () => {
  const form = document.querySelector("#ResetPasswordForm")
  if(!form.pswd || !form.reser_pswd || pattern_otp.test(form.otp.value))
  {
    showalert("alert-danger","passwords does not match")
    topFunction()
    return false
  }
  return true
}