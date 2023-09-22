const socket = io('http://localhost:5270',{transports:["websocket"]});
const form = document.getElementById('send-container');
const msgInput = document.getElementById('message-input');
const msgContainer = document.querySelector('.chat-messages');
const page = document.querySelector('body');
var audio = new Audio('./audio.mp3');


const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    msgContainer.append(messageElement);
    if (position=='left') {
            audio.play();

    }
}
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = msgInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    msgInput.value='';
})

let myFun = ()=>{
Swal.fire({
    title:'Enter Your Name',
    input:'text',
    confirmButtonText:'Submit',
    allowOutsideClick:false,
}).then((result)=>{
    if (result.value!=='') {
        const name = result.value;
        socket.emit('new-user-joined',name);

    }
    else{
        Swal.fire({
            icon:"error",
            title:"Please enter your name",
            allowOutsideClick:false,
        }).then((error)=>{
            myFun();
        })
    }
})
}
myFun();

socket.on('user-joined', name =>{
append(`${name} joined the chat.`,'right')
})

socket.on('receive', data =>{
append(`${data.name}:${data.message} `,'left')
})
socket.on('left',name=>{
    append(`${name} left the chat`,'left')
})
