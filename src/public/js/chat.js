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

    let submitChatbox = document.getElementById('submitChatbox')
    let chatbox = document.getElementById("chatbox")

    submitChatbox.onclick = async()=>{
        if(chatbox.value.trim().length > 0){
            let newMessage = {
                userEmail: userEmail,
                message:chatbox.value
            }
            console.log(newMessage)
            fetch('/api/chat',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMessage)
            })
            .then(result=>result.json())
            .then(()=>fetch('/api/chat',{
                method:'GET'
            }))
            .then(result=>result.json())
            .then(json=>{
                socket.emit('newMessage', json.payload)
            })
        }
        chatbox.value=""
    }
    
 

    socket.on('log',data=>{
        let logContainer = document.getElementById('logContainer')
        logContainer.innerHTML="";
        for (const message of data){
            const messageLine = document.createElement('div');
            messageLine.innerHTML = `<p>${message.userEmail} dijo a las ${message.timestamp}: ${message.message} </p>`
            logContainer.appendChild(messageLine)
        }
    })
})


