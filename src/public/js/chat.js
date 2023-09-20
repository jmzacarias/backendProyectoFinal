Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Identificate con tu correo electrónico',
    inputValidator: value=>{
        return !value.trim() && 'Por favor, ingresá un correo electrónico válido'
    },
    allowOutsideClick: false
}).then(result => {
    let userEmail = result.value
    document.getElementById('userEmail').innerHTML = userEmail
    let socket = io()

    let chatbox = document.getElementById('chatbox')
    
    chatbox.addEventListener('keyup', async(event)=>{
        if(event.key === 'Enter'){
            if(chatbox.value.trim().length > 0){
                let newMessage = {
                    userEmail,
                    message:chatbox.value
                }
                fetch('/api/chat',{
                    method:'POST',
                    body: newMessage
                })
                .then(result=>result.json())
                .then(()=>fetch('/api/products',{
                    method:'GET'
                }))
                .then(result=>result.json())
                .then(result=>{
                    socket.emit('newMessage', result.payload)
                })
            }
            chatbox.value=""
        }
    })

    socket.on('log', data=>{
        let logContainer = document.getElementById('log')
        logContainer.innerHTML = "";
        for (const message of data) {
            const messageLine= document.createElement('div');
            messageLine.innerHTML =
                `<p>${message.userEmail} dijo a las ${message.timestamp}: ${message.message}</p>`
            logContainer.appendChild(messageLine)
         }
    })
})

