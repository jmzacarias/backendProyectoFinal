logout = ()=>{
    fetch('/api/sessions/logout', {
        method: 'GET'
    })
    .then(response => {
        if (response.status === 200) {
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Error al cerrar sesión: ', error);
    });
}