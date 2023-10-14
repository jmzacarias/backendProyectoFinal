
addProductToCart = (id)=>{
    fetch('/api/carts',{
        method:'GET'
    }).then(result=>result.json())
    .then((result)=>{
        console.log(result)
        fetch(`/api/carts/${result.payload._id}/products/${id}`,{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    })
}

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