const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', event=>{
    event.preventDefault();
    const formData = new FormData(registerForm)
    let newUser = {}
    for (const [key, value] of formData.entries()) {
        newUser[key] = value;
      }
    console.log({newUser:newUser})
    fetch('/api/sessions/register',{
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body:JSON.stringify(newUser)
    })
    .then ((response)=>{
        if(response.status===200) {
            alert('Registro exitoso')
            window.location.href = '/';
        }else{
            alert(`Error: El email ${newUser.email} ya se encuentra registrado`)
            registerForm.reset()
        }
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
})