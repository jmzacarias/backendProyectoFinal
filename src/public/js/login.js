const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', event=>{
    event.preventDefault();
    const formData = new FormData(loginForm)
    let user = {}
    for (const [key, value] of formData.entries()) {
        user[key] = value;
      }
      console.log({user:user})
    fetch('/api/sessions/login',{
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body:JSON.stringify(user)
    })
    .then
    loginForm.reset()
})