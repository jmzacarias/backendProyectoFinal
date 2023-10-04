hola = (saludo)=>{
    alert(saludo)
}

addProductToCart = (id)=>{
    fetch('/api/carts',{
        method:'GET'
    }).then(result=>result.json())
    .then((result)=>{
        console.log(result)
        fetch(`/api/carts/${result.payload._id}/products/${id}`,{
            method: 'post',
            // body: {product: id, quantity: 1},
            headers: {
                'Content-Type': 'application/json'
            },
        })
    })
}