const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', event=>{
    event.preventDefault();
    const formData = new FormData(loginForm)
    let user = {}
    for (const [key, value] of formData.entries()) {
        user[key] = value;
      }
    fetch('/api/sessions/login',{
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body:JSON.stringify(user)
    })
    .then ((response)=>{
        if(response.status===200) {
            alert('Identificacion exitosa')
            window.location.href = '/products';
        }else{
            alert(`Credenciales incorrectas`)
            loginForm.reset()
        }
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
})