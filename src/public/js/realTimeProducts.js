

const productForm = document.getElementById('productForm')

const socket = io();

productForm.addEventListener('submit',event=>{
    event.preventDefault();
    const formData = new FormData(productForm);
    fetch('/api/products',{
        method:'POST',
        body:formData
    })
    .then(result=>result.json())
    .then(json=> console.log(json))
    .then(()=>fetch('/api/products',{
        method:'GET'
    }))
    .then(result=>result.json())
    .then(result=>{
        socket.emit('updatedProducts',result.payload);
    })
    productForm.reset()
})

deleteProduct = (id)=>{
    fetch(`/api/products/${id}`, {
        method:'delete'
    })
    .then(result=>result.json())
    .then(json=>console.log(json))
    .then(()=>fetch('/api/products',{
        method:'GET'
    }))
    .then(result=>result.json())
    .then(result=>{
        socket.emit('updatedProducts',result.payload);
    })
}

socket.on('newProductsList', data =>{
    let productsListContainer = document.getElementById('productsList');
    productsListContainer.innerHTML="";
    for (const product of data) {
        const div = document.createElement('div');
        div.setAttribute("id",`productCardId${product._id}`)
        div.innerHTML=
            `<p>Producto: ${product.title}</p>
            <p>Precio: $${product.price}</p>
            <p>Descripción: ${product.description}</p>
            <button id=${product.id} onclick="deleteProduct(${product._id})" >Eliminar</button>
            <hr>`
        productsListContainer.appendChild(div)
    }

})
